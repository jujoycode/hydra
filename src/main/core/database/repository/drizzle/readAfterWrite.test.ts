import { randomUUID } from 'node:crypto'
import { resolve } from 'node:path'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { createTestDatabase, dropTestDatabase, pgTestConfig } from '../../__testutils__/pgTestDb'
import { PostgresAdapter } from '../../adapter/PostgresAdapter'
import * as schema from '../../schema/drizzle/schema'
import { DrizzleIssueRepository } from './DrizzleIssueRepository'
import { DrizzleProjectRepository } from './DrizzleProjectRepository'

describe.runIf(process.env.RUN_DB_TESTS === '1')('read-after-write (no RETURNING)', () => {
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

  it('create() returns the inserted row without RETURNING', async () => {
    const db = adapter.getConnection()
    const userId = randomUUID()
    await db.insert(schema.users).values({
      user_id: userId,
      user_sn: userId,
      user_password_hash: 'test-hash',
      user_name: 'tester',
      user_role: 'admin'
    })

    const projectRepo = new DrizzleProjectRepository(db)
    const projectId = randomUUID()
    const project = await projectRepo.create({
      projectId,
      projectName: 'P',
      projectKey: `K-${Date.now()}`,
      createdBy: userId,
      startDate: new Date(),
      endDate: new Date()
    })
    expect(project.project_id).toBe(projectId)
    expect(project.project_name).toBe('P')

    const issueRepo = new DrizzleIssueRepository(db)
    const issueId = randomUUID()
    const created = await issueRepo.create({
      issueId,
      projectId,
      issueTitle: 'hello',
      issueKey: 'K-1',
      createdBy: userId
    })
    expect(created.issue_id).toBe(issueId)

    const updated = await issueRepo.update(issueId, { issueTitle: 'world', modifiedBy: userId })
    expect(updated.issue_title).toBe('world')
  })

  it('case-insensitive search matches regardless of case', async () => {
    const db = adapter.getConnection()
    const userId = randomUUID()
    await db.insert(schema.users).values({
      user_id: userId,
      user_sn: userId,
      user_password_hash: 'test-hash',
      user_name: 't2',
      user_role: 'admin'
    })
    const projectId = randomUUID()
    await new DrizzleProjectRepository(db).create({
      projectId,
      projectName: 'P2',
      projectKey: `K2-${Date.now()}`,
      createdBy: userId,
      startDate: new Date(),
      endDate: new Date()
    })
    const issueRepo = new DrizzleIssueRepository(db)
    await issueRepo.create({
      issueId: randomUUID(),
      projectId,
      issueTitle: 'FindMe Bug',
      issueKey: 'K2-1',
      createdBy: userId
    })

    const res = await issueRepo.findByProjectFiltered(projectId, { search: 'findme' })
    expect(res.total).toBe(1)
    expect(res.data[0].issue_title).toBe('FindMe Bug')
  })
})
