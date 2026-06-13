import { randomUUID } from 'node:crypto'
import { resolve } from 'node:path'
import { eq } from 'drizzle-orm'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { createTestDatabase, dropTestDatabase, pgTestConfig } from './__testutils__/pgTestDb'
import { PostgresAdapter } from './adapter/PostgresAdapter'
import { DrizzleProjectRepository } from './repository/drizzle/DrizzleProjectRepository'
import * as schema from './schema/drizzle/schema'

describe.runIf(process.env.RUN_DB_TESTS === '1')('transaction atomicity', () => {
  let adapter: PostgresAdapter
  let dbName: string

  beforeAll(async () => {
    dbName = await createTestDatabase()
    adapter = new PostgresAdapter()
    await adapter.connect({ ...pgTestConfig(), database: dbName })
    await adapter.runMigrations(resolve(process.cwd(), 'drizzle/pg'))
  }, 30000)

  afterAll(async () => {
    await adapter.disconnect()
    await dropTestDatabase(dbName)
  }, 30000)

  it('rolls back the project insert when a later write throws', async () => {
    const db = adapter.getConnection()
    const repo = new DrizzleProjectRepository(db)

    const userId = randomUUID()
    await db.insert(schema.users).values({
      user_id: userId,
      user_sn: userId,
      user_password_hash: 'test-hash',
      user_name: 'tester',
      user_role: 'admin'
    })

    const projectId = randomUUID()
    await expect(
      adapter.transaction(async (tx) => {
        await repo.create(
          {
            projectId,
            projectName: 'P',
            projectKey: 'P1',
            createdBy: userId,
            startDate: new Date(),
            endDate: new Date()
          },
          tx
        )
        throw new Error('boom') // insert 이후 강제 롤백
      })
    ).rejects.toThrow('boom')

    const found = await db.select().from(schema.projects).where(eq(schema.projects.project_id, projectId))
    expect(found).toHaveLength(0)
  })
})
