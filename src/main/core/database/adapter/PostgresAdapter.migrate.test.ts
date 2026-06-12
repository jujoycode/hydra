import { resolve } from 'node:path'
import { sql } from 'drizzle-orm'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { createTestDatabase, dropTestDatabase, pgTestConfig } from '../__testutils__/pgTestDb'
import { PostgresAdapter } from './PostgresAdapter'

const migrationsFolder = resolve(process.cwd(), 'drizzle')

describe.runIf(process.env.RUN_DB_TESTS === '1')('PostgresAdapter.runMigrations', () => {
  let adapter: PostgresAdapter
  let dbName: string

  beforeAll(async () => {
    dbName = await createTestDatabase()
    adapter = new PostgresAdapter()
    await adapter.connect({ ...pgTestConfig(), database: dbName })
  })

  afterAll(async () => {
    await adapter.disconnect()
    await dropTestDatabase(dbName)
  })

  it('creates all application tables', async () => {
    await adapter.runMigrations(migrationsFolder)
    const db = adapter.getConnection()
    const res = await db.execute(sql`SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'`)
    const names = res.rows.map((r) => r.table_name as string)
    expect(names).toEqual(expect.arrayContaining(['users', 'projects', 'issues', 'comments', 'notifications']))
  })

  it('is idempotent on a second run', async () => {
    await expect(adapter.runMigrations(migrationsFolder)).resolves.not.toThrow()
  })
})
