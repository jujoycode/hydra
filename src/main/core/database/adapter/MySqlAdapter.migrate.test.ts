import { resolve } from 'node:path'
import mysql from 'mysql2/promise'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { createMySqlTestDatabase, dropMySqlTestDatabase, mysqlTestConfig } from '../__testutils__/mysqlTestDb'
import { MySqlAdapter } from './MySqlAdapter'

const MIGRATIONS = resolve(process.cwd(), 'drizzle/mysql')

describe.runIf(process.env.RUN_DB_TESTS_MYSQL === '1')('MySqlAdapter migrations', () => {
  let adapter: MySqlAdapter
  let dbName: string

  beforeAll(async () => {
    dbName = await createMySqlTestDatabase()
    adapter = new MySqlAdapter()
    await adapter.connect({ ...mysqlTestConfig(), database: dbName })
  })

  afterAll(async () => {
    try {
      await adapter.disconnect()
    } finally {
      if (dbName) await dropMySqlTestDatabase(dbName)
    }
  })

  it('applies the baseline migration (15 tables + journal)', async () => {
    await adapter.runMigrations(MIGRATIONS)
    const db = adapter.getConnection()
    const [rows] = await db.execute(
      `SELECT COUNT(*) AS cnt FROM information_schema.tables WHERE table_schema = '${dbName}' AND table_name NOT LIKE '\\_\\_%'`
    )
    expect(Number((rows as unknown as Array<{ cnt: number | string }>)[0].cnt)).toBe(15)
  })

  it('is idempotent on re-run', async () => {
    await expect(adapter.runMigrations(MIGRATIONS)).resolves.not.toThrow()
  })

  it('stores uuid columns as ascii_bin char(36)', async () => {
    const db = adapter.getConnection()
    const [rows] = await db.execute(
      `SELECT collation_name AS cn FROM information_schema.columns WHERE table_schema = '${dbName}' AND table_name = 'users' AND column_name = 'user_id'`
    )
    expect((rows as unknown as Array<{ cn: string }>)[0].cn).toBe('ascii_bin')
  })

  it('skips the migrator for a DML-only account when schema is current', async () => {
    const cfg = mysqlTestConfig()
    const dmlUser = `dml_${Date.now() % 100000}`
    const admin = await mysql.createConnection(cfg)
    try {
      await admin.query(`CREATE USER '${dmlUser}'@'%' IDENTIFIED BY 'dmlpw'`)
      await admin.query(`GRANT SELECT, INSERT, UPDATE, DELETE ON \`${dbName}\`.* TO '${dmlUser}'@'%'`)
    } finally {
      await admin.end()
    }
    const dmlAdapter = new MySqlAdapter()
    try {
      await dmlAdapter.connect({ ...cfg, user: dmlUser, password: 'dmlpw', database: dbName })
      // 스키마는 beforeAll에서 root로 이미 최신 적용됨 → DML-only 계정도 통과해야 한다
      await expect(dmlAdapter.runMigrations(MIGRATIONS)).resolves.not.toThrow()
    } finally {
      await dmlAdapter.disconnect()
      const cleanup = await mysql.createConnection(cfg)
      await cleanup.query(`DROP USER IF EXISTS '${dmlUser}'@'%'`).catch(() => {})
      await cleanup.end()
    }
  })
})
