import { randomUUID } from 'node:crypto'
import { resolve } from 'node:path'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { createTestDatabase, dropTestDatabase, pgTestConfig } from '../../__testutils__/pgTestDb'
import { PostgresAdapter } from '../../adapter/PostgresAdapter'
import * as schema from '../../schema/drizzle/schema'
import { DrizzleIssueRepository } from './DrizzleIssueRepository'
import { DrizzleProjectRepository } from './DrizzleProjectRepository'
import { DrizzleUserRepository } from './DrizzleUserRepository'

// 멤버십 기반 조회: findByProject(멤버) / findByAssignee / findByUserProjects(서브쿼리)
describe.runIf(process.env.RUN_DB_TESTS === '1')('member/assignee 조회 (멤버십 join)', () => {
  let adapter: PostgresAdapter
  let dbName: string

  // u1 ∈ {p1, p2}, u2 ∈ {p1}; 이슈: i1(p1,→u1), i2(p2,→u2), i3(p1,→u2)
  const u1 = randomUUID()
  const u2 = randomUUID()
  const p1 = randomUUID()
  const p2 = randomUUID()
  const i1 = randomUUID()
  const i2 = randomUUID()
  const i3 = randomUUID()

  beforeAll(async () => {
    dbName = await createTestDatabase()
    adapter = new PostgresAdapter()
    await adapter.connect({ ...pgTestConfig(), database: dbName })
    await adapter.runMigrations(resolve(process.cwd(), 'drizzle/pg'))

    const db = adapter.getConnection()
    for (const [id, name] of [
      [u1, 'user-one'],
      [u2, 'user-two']
    ] as const) {
      await db.insert(schema.users).values({
        user_id: id,
        user_sn: id,
        user_password_hash: 'h',
        user_name: name,
        user_role: 'member'
      })
    }

    const projectRepo = new DrizzleProjectRepository(db)
    const issueRepo = new DrizzleIssueRepository(db)
    for (const [pid, key] of [
      [p1, 'P1'],
      [p2, 'P2']
    ] as const) {
      await projectRepo.create({
        projectId: pid,
        projectName: pid,
        projectKey: `${key}-${Date.now()}`,
        createdBy: u1,
        startDate: new Date(),
        endDate: new Date()
      })
    }
    await projectRepo.linkUser(randomUUID(), u1, p1)
    await projectRepo.linkUser(randomUUID(), u1, p2)
    await projectRepo.linkUser(randomUUID(), u2, p1)

    for (const [iid, pid, assignee] of [
      [i1, p1, u1],
      [i2, p2, u2],
      [i3, p1, u2]
    ] as const) {
      await issueRepo.create({
        issueId: iid,
        projectId: pid,
        issueTitle: iid,
        issueKey: `${iid}`,
        createdBy: u1,
        assignedTo: assignee
      })
    }
  }, 30000)

  afterAll(async () => {
    await adapter.disconnect()
    await dropTestDatabase(dbName)
  }, 30000)

  it('findByProject: 프로젝트 멤버만 반환한다', async () => {
    const repo = new DrizzleUserRepository(adapter.getConnection())
    const p1Members = (await repo.findByProject(p1)).map((u) => u.user_id).sort()
    expect(p1Members).toEqual([u1, u2].sort())
    const p2Members = (await repo.findByProject(p2)).map((u) => u.user_id)
    expect(p2Members).toEqual([u1])
  })

  it('findByAssignee: 담당 이슈를 전 프로젝트에서 반환한다', async () => {
    const repo = new DrizzleIssueRepository(adapter.getConnection())
    const u2Issues = (await repo.findByAssignee(u2)).map((i) => i.issue_id).sort()
    expect(u2Issues).toEqual([i2, i3].sort())
    const u1Issues = (await repo.findByAssignee(u1)).map((i) => i.issue_id)
    expect(u1Issues).toEqual([i1])
  })

  it('findByUserProjects: 멤버십 서브쿼리로 소속 프로젝트의 모든 이슈를 반환한다', async () => {
    const repo = new DrizzleIssueRepository(adapter.getConnection())
    // u1은 p1+p2 멤버 → 전 이슈
    const u1All = (await repo.findByUserProjects(u1)).map((i) => i.issue_id).sort()
    expect(u1All).toEqual([i1, i2, i3].sort())
    // u2는 p1 멤버 → p1 이슈만 (i1, i3)
    const u2All = (await repo.findByUserProjects(u2)).map((i) => i.issue_id).sort()
    expect(u2All).toEqual([i1, i3].sort())
  })
})
