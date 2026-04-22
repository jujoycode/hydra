// PostgreSQL 어댑터 - drizzle-orm + pg Pool 기반 구현

import fs from 'node:fs'
import { sql } from 'drizzle-orm'
import type { NodePgDatabase } from 'drizzle-orm/node-postgres'
import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import { DatabaseError } from '@/error/DatabaseError'
import { ErrorCode } from '@/interface/CoreInterface'
import * as schema from '../schema/drizzle/schema'
import type { ConnectionConfig, DatabaseAdapter } from './DatabaseAdapter'

// pg 에러를 사용자 친화 메시지를 가진 DatabaseError로 래핑
function wrapPgError(error: unknown, ctx: { host?: string; port?: number; database?: string; user?: string }): DatabaseError {
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
    return new DatabaseError(
      ErrorCode.NOT_FOUND_ERROR,
      `Database "${ctx.database ?? 'unknown'}" does not exist.`,
      { pgCode: code }
    )
  }
  if (code === '42501') {
    return new DatabaseError(
      ErrorCode.PERMISSION_ERROR,
      `Permission denied for user "${ctx.user ?? 'unknown'}".`,
      { pgCode: code }
    )
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

  async createRole(roleName: string, password: string): Promise<void> {
    if (!this.db) {
      throw new Error('Database not connected. Call connect() first.')
    }
    const escapedRole = roleName.replace(/"/g, '""')
    const escapedPassword = password.replace(/'/g, "''")
    await this.db.execute(sql.raw(`CREATE ROLE "${escapedRole}" WITH LOGIN PASSWORD '${escapedPassword}'`))
  }

  async dropRole(roleName: string): Promise<void> {
    if (!this.db) {
      throw new Error('Database not connected. Call connect() first.')
    }
    const escapedRole = roleName.replace(/"/g, '""')
    await this.db.execute(sql.raw(`DROP ROLE IF EXISTS "${escapedRole}"`))
  }

  async runMigrations(): Promise<void> {
    console.log('Migrations: use drizzle-kit push')
  }

  async transaction<T>(fn: (tx: unknown) => Promise<T>): Promise<T> {
    if (!this.db) {
      throw new Error('Database not connected. Call connect() first.')
    }
    return this.db.transaction(async (tx) => fn(tx))
  }
}
