import { resolve } from 'node:path'
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
    await adapter.disconnect()
    await dropMySqlTestDatabase(dbName)
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
})
