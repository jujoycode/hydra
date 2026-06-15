import { randomUUID } from 'node:crypto'
import { resolve } from 'node:path'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { createTestDatabase, dropTestDatabase, pgTestConfig } from '../../__testutils__/pgTestDb'
import { PostgresAdapter } from '../../adapter/PostgresAdapter'
import * as schema from '../../schema/drizzle/schema'
import { DrizzleActivityLogRepository } from './DrizzleActivityLogRepository'

describe.runIf(process.env.RUN_DB_TESTS === '1')('DrizzleActivityLogRepository', () => {
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

  it('create로 기록하고 findByEntity로 엔티티별 조회한다', async () => {
    const db = adapter.getConnection()
    const repo = new DrizzleActivityLogRepository(db)

    const actorId = randomUUID()
    await db.insert(schema.users).values({
      user_id: actorId,
      user_sn: actorId,
      user_password_hash: 'h',
      user_role: 'member'
    })

    const entityId = randomUUID()
    const created = await repo.create({
      activityId: randomUUID(),
      entityType: 'issue',
      entityId,
      action: 'status_changed',
      actorId,
      metadata: JSON.stringify({ from: 'backlog', to: 'done' })
    })
    expect(created.activity_action).toBe('status_changed')
    expect(created.activity_metadata).toContain('done')
    expect(created.activity_created_at).not.toBeNull()

    await repo.create({ activityId: randomUUID(), entityType: 'issue', entityId, action: 'assigned', actorId })

    const list = await repo.findByEntity('issue', entityId)
    expect(list).toHaveLength(2)
    expect(list.map((a) => a.activity_action).sort()).toEqual(['assigned', 'status_changed'])

    // 다른 엔티티의 활동은 섞이지 않는다
    expect(await repo.findByEntity('issue', randomUUID())).toEqual([])
  })
})
