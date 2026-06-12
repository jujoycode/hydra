// MySQL 어댑터 - drizzle-orm + mysql2 Pool 기반 구현 (스펙 §4.1, §7)

import fs from 'node:fs'
import type { MySql2Database } from 'drizzle-orm/mysql2'
import { drizzle } from 'drizzle-orm/mysql2'
import { migrate } from 'drizzle-orm/mysql2/migrator'
import type { Pool, PoolOptions, RowDataPacket } from 'mysql2/promise'
import mysql from 'mysql2/promise'
import { DatabaseError } from '@/error/DatabaseError'
import { ErrorCode } from '@/interface/CoreInterface'
import * as schema from '../schema/drizzle/schema.mysql'
import type { ConnectionConfig, DatabaseAdapter } from './DatabaseAdapter'

// MySQL errno / Node errno를 PostgresAdapter.wrapPgError와 같은 비즈니스 에러로 매핑
export function wrapMySqlError(
  error: unknown,
  ctx: { host?: string; port?: number; database?: string; user?: string }
): DatabaseError {
  const err = error as { errno?: number; code?: string; message?: string }
  const errno = err?.errno
  const rawMessage = err?.message ?? 'Unknown database error'

  // MySQL server error codes
  if (errno === 1045) {
    // ER_ACCESS_DENIED_ERROR
    return new DatabaseError(
      ErrorCode.AUTH_ERROR,
      `Authentication failed for user "${ctx.user ?? 'unknown'}". Please check your username and password.`,
      { mysqlErrno: errno }
    )
  }
  if (errno === 1049) {
    // ER_BAD_DB_ERROR
    return new DatabaseError(ErrorCode.NOT_FOUND_ERROR, `Database "${ctx.database ?? 'unknown'}" does not exist.`, {
      mysqlErrno: errno
    })
  }
  if (errno === 1044 || errno === 1142 || errno === 1227) {
    // ER_DBACCESS_DENIED / ER_TABLEACCESS_DENIED / ER_SPECIFIC_ACCESS_DENIED
    return new DatabaseError(ErrorCode.PERMISSION_ERROR, `Permission denied for user "${ctx.user ?? 'unknown'}".`, {
      mysqlErrno: errno
    })
  }

  // Network-level errors (Node.js errno codes)
  const code = err?.code
  if (code === 'ECONNREFUSED') {
    return new DatabaseError(
      ErrorCode.NETWORK_ERROR,
      `Cannot connect to database server at ${ctx.host ?? '?'}:${ctx.port ?? '?'}. Please check if the server is running.`,
      { mysqlCode: code }
    )
  }
  if (code === 'ENOTFOUND' || code === 'EAI_AGAIN') {
    return new DatabaseError(
      ErrorCode.NETWORK_ERROR,
      `Host "${ctx.host ?? 'unknown'}" could not be resolved. Please check the hostname.`,
      { mysqlCode: code }
    )
  }
  if (code === 'ETIMEDOUT' || code === 'ECONNRESET') {
    return new DatabaseError(
      ErrorCode.NETWORK_ERROR,
      `Connection to ${ctx.host ?? '?'}:${ctx.port ?? '?'} timed out or was reset. Please check your network.`,
      { mysqlCode: code }
    )
  }

  return new DatabaseError(ErrorCode.DB_ERROR, rawMessage, { mysqlErrno: errno, mysqlCode: code })
}

export class MySqlAdapter implements DatabaseAdapter {
  private pool: Pool | null = null
  private db: MySql2Database<typeof schema> | null = null

  async connect(config: ConnectionConfig): Promise<void> {
    const poolOptions: PoolOptions = {
      host: config.host,
      port: config.port,
      database: config.database,
      user: config.user,
      password: config.password,
      timezone: 'Z', // UTC 고정 — 세션 TZ 변환 차단 (스펙 §6.2.2)
      connectTimeout: 5000,
      connectionLimit: 10
    }

    if (config.sslCertPath) {
      poolOptions.ssl = { ca: fs.readFileSync(config.sslCertPath, 'utf-8') }
    }

    const pool = mysql.createPool(poolOptions)

    // Pool warm-up + utf8mb4 검증 (스펙 §7 — 기존 DB를 조용히 가정하지 않는다)
    try {
      const conn = await pool.getConnection()
      try {
        const [rows] = await conn.query<RowDataPacket[]>('SELECT @@character_set_database AS cs')
        const cs = rows[0]?.cs as string | undefined
        if (cs !== 'utf8mb4') {
          console.warn(`[MySqlAdapter] database charset is "${cs}", expected utf8mb4 — non-ASCII text may corrupt`)
        }
      } finally {
        conn.release()
      }
    } catch (error: unknown) {
      pool.end().catch(() => {})
      throw wrapMySqlError(error, {
        host: config.host,
        port: config.port,
        database: config.database,
        user: config.user
      })
    }

    this.pool = pool
    this.db = drizzle(pool, { schema, mode: 'default' })
  }

  async disconnect(): Promise<void> {
    if (this.pool) {
      await this.pool.end()
      this.pool = null
      this.db = null
    }
  }

  isConnected(): boolean {
    return this.pool !== null && this.db !== null
  }

  getConnection(): MySql2Database<typeof schema> {
    if (!this.db) {
      throw new Error('Database not connected. Call connect() first.')
    }
    return this.db
  }

  // GET_LOCK으로 동시 기동 마이그레이션 가드 (스펙 §8.4 — PG advisory lock 대응물)
  async runMigrations(migrationsFolder: string): Promise<void> {
    if (!this.db || !this.pool) {
      throw new Error('Database not connected. Call connect() first.')
    }
    const conn = await this.pool.getConnection()
    try {
      const [rows] = await conn.query<RowDataPacket[]>("SELECT GET_LOCK('hydra_migrations', 60) AS got")
      if (Number(rows[0]?.got) !== 1) {
        throw new DatabaseError(
          ErrorCode.DB_ERROR,
          'Could not acquire migration lock (another instance migrating?)',
          null
        )
      }
      await migrate(this.db, { migrationsFolder })
    } finally {
      await conn.query("SELECT RELEASE_LOCK('hydra_migrations')").catch(() => {})
      conn.release()
    }
  }

  // 격리 수준을 PG 기본(READ COMMITTED)과 일치시킨다 (스펙 §7)
  async transaction<T>(fn: (tx: unknown) => Promise<T>): Promise<T> {
    if (!this.db) {
      throw new Error('Database not connected. Call connect() first.')
    }
    return this.db.transaction(async (tx) => fn(tx), { isolationLevel: 'read committed' })
  }
}
