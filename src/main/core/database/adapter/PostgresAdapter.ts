// PostgreSQL 어댑터 - drizzle-orm + pg Pool 기반 구현

import fs from 'node:fs'
import { sql } from 'drizzle-orm'
import type { NodePgDatabase } from 'drizzle-orm/node-postgres'
import { drizzle } from 'drizzle-orm/node-postgres'
import { migrate } from 'drizzle-orm/node-postgres/migrator'
import { Pool } from 'pg'
import { DatabaseError } from '@/error/DatabaseError'
import { ErrorCode } from '@/interface/CoreInterface'
import * as schema from '../schema/drizzle/schema'
import type { ConnectionConfig, DatabaseAdapter } from './DatabaseAdapter'

// pg 에러를 사용자 친화 메시지를 가진 DatabaseError로 래핑
function wrapPgError(
  error: unknown,
  ctx: { host?: string; port?: number; database?: string; user?: string }
): DatabaseError {
  const err = error as { code?: string; message?: string }
  const code = err?.code
  const rawMessage = err?.message ?? 'Unknown database error'

  // PostgreSQL SQLSTATE codes
  if (code === '28P01' || code === '28000') {
    return new DatabaseError(
      ErrorCode.AUTH_ERROR,
      `Authentication failed for user "${ctx.user ?? 'unknown'}". Please check your username and password.`,
      { pgCode: code }
    )
  }
  if (code === '3D000') {
    return new DatabaseError(ErrorCode.NOT_FOUND_ERROR, `Database "${ctx.database ?? 'unknown'}" does not exist.`, {
      pgCode: code
    })
  }
  if (code === '42501') {
    return new DatabaseError(ErrorCode.PERMISSION_ERROR, `Permission denied for user "${ctx.user ?? 'unknown'}".`, {
      pgCode: code
    })
  }

  // Network-level errors (Node.js errno codes)
  if (code === 'ECONNREFUSED') {
    return new DatabaseError(
      ErrorCode.NETWORK_ERROR,
      `Cannot connect to database server at ${ctx.host ?? '?'}:${ctx.port ?? '?'}. Please check if the server is running.`,
      { pgCode: code }
    )
  }
  if (code === 'ENOTFOUND' || code === 'EAI_AGAIN') {
    return new DatabaseError(
      ErrorCode.NETWORK_ERROR,
      `Host "${ctx.host ?? 'unknown'}" could not be resolved. Please check the hostname.`,
      { pgCode: code }
    )
  }
  if (code === 'ETIMEDOUT' || code === 'ECONNRESET') {
    return new DatabaseError(
      ErrorCode.NETWORK_ERROR,
      `Connection to ${ctx.host ?? '?'}:${ctx.port ?? '?'} timed out or was reset. Please check your network.`,
      { pgCode: code }
    )
  }

  // Fallback: preserve original message
  return new DatabaseError(ErrorCode.DB_ERROR, rawMessage, { pgCode: code })
}

export class PostgresAdapter implements DatabaseAdapter {
  private pool: Pool | null = null
  private db: NodePgDatabase<typeof schema> | null = null

  async connect(config: ConnectionConfig): Promise<void> {
    const poolConfig: ConstructorParameters<typeof Pool>[0] = {
      host: config.host,
      port: config.port,
      database: config.database,
      user: config.user,
      password: config.password
    }

    if (config.sslCertPath) {
      const ca = fs.readFileSync(config.sslCertPath, 'utf-8')
      poolConfig.ssl = { ca }
    }

    poolConfig.connectionTimeoutMillis = 5000

    const pool = new Pool(poolConfig)

    // Pool warm-up: eager connect로 연결 검증 및 초기화
    try {
      const client = await pool.connect()
      client.release()
    } catch (error: unknown) {
      // 실패한 pool이 leak되지 않도록 정리
      pool.end().catch(() => {})
      throw wrapPgError(error, {
        host: config.host,
        port: config.port,
        database: config.database,
        user: config.user
      })
    }

    this.pool = pool
    this.db = drizzle(this.pool, { schema })
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

  getConnection(): NodePgDatabase<typeof schema> {
    if (!this.db) {
      throw new Error('Database not connected. Call connect() first.')
    }
    return this.db
  }

  // 동시 기동 마이그레이션 가드 (스펙 §8.4) — DB 스코프 advisory lock, MySqlAdapter.runMigrations(GET_LOCK)와 대칭
  async runMigrations(migrationsFolder: string): Promise<void> {
    if (!this.db || !this.pool) {
      throw new Error('Database not connected. Call connect() first.')
    }
    const client = await this.pool.connect()
    try {
      // hashtext는 현재 DB 안에서만 의미 — 같은 서버의 다른 DB와 경합하지 않는다
      await client.query("SELECT pg_advisory_lock(hashtext('hydra_migrations'))")
      await migrate(this.db, { migrationsFolder })
    } finally {
      try {
        await client.query("SELECT pg_advisory_unlock(hashtext('hydra_migrations'))")
        client.release()
      } catch {
        // unlock 실패는 사실상 죽은 커넥션 — 풀에 되돌리지 않고 폐기 (락은 세션 종료로 자동 해제)
        client.release(true)
      }
    }
  }

  async transaction<T>(fn: (tx: unknown) => Promise<T>): Promise<T> {
    if (!this.db) {
      throw new Error('Database not connected. Call connect() first.')
    }
    return this.db.transaction(async (tx) => fn(tx))
  }

  // pg_advisory_xact_lock: 트랜잭션 스코프 락 — 같은 트랜잭션 커밋/롤백 시 자동 해제되므로
  // 락을 트랜잭션 안에서 잡으면 충분하다 (MySqlAdapter는 세션 스코프 GET_LOCK이라 다르게 처리)
  async transactionWithAdvisoryLock<T>(lockKey: number, fn: (tx: unknown) => Promise<T>): Promise<T> {
    if (!this.db) {
      throw new Error('Database not connected. Call connect() first.')
    }
    return this.db.transaction(async (tx) => {
      await tx.execute(sql`SELECT pg_advisory_xact_lock(${lockKey})`)
      return fn(tx)
    })
  }
}
