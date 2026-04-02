// PostgreSQL 어댑터 - drizzle-orm + pg Pool 기반 구현

import fs from 'node:fs'
import { sql } from 'drizzle-orm'
import type { NodePgDatabase } from 'drizzle-orm/node-postgres'
import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import * as schema from '../schema/drizzle/schema'
import type { ConnectionConfig, DatabaseAdapter } from './DatabaseAdapter'

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

    this.pool = new Pool(poolConfig)

    // Pool warm-up: eager connect로 연결 검증 및 초기화
    const client = await this.pool.connect()
    client.release()

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
