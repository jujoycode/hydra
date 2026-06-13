import { randomUUID } from 'node:crypto'
import { resolve } from 'node:path'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { normalizeHandle } from '../auth/normalize'
import { hashPassword } from '../auth/password'
import { createTestDatabase, dropTestDatabase, pgTestConfig } from '../database/__testutils__/pgTestDb'
import { PostgresAdapter } from '../database/adapter/PostgresAdapter'
import { DrizzleIssueRepository } from '../database/repository/drizzle/DrizzleIssueRepository'
import { DrizzleProjectRepository } from '../database/repository/drizzle/DrizzleProjectRepository'
import { DrizzleUserRepository } from '../database/repository/drizzle/DrizzleUserRepository'

// 핵심 사용자 여정을 end-to-end로: admin 생성 → 프로젝트/멤버 → 이슈 CRUD → 조회 경로들
describe.runIf(process.env.RUN_DB_TESTS === '1')('flow: admin → 프로젝트 → 이슈 CRUD', () => {
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

  it('생성→조회(멤버/담당/대시보드)→수정→삭제가 일관되게 동작한다', async () => {
    const db = adapter.getConnection()
    const userRepo = new DrizzleUserRepository(db)
    const projectRepo = new DrizzleProjectRepository(db)
    const issueRepo = new DrizzleIssueRepository(db)

    // 1) admin
    const adminId = randomUUID()
    await userRepo.create({
      userId: adminId,
      userSn: normalizeHandle('flow-admin'),
      passwordHash: await hashPassword('pw'),
      userName: 'Flow Admin',
      userRole: 'admin'
    })

    // 2) 프로젝트 + 멤버 링크
    const projectId = randomUUID()
    await projectRepo.create({
      projectId,
      projectName: 'Flow',
      projectKey: `FL-${Date.now()}`,
      createdBy: adminId,
      startDate: new Date(),
      endDate: new Date()
    })
    await projectRepo.linkUser(randomUUID(), adminId, projectId)
    expect((await userRepo.findByProject(projectId)).map((u) => u.user_id)).toEqual([adminId])
    expect((await projectRepo.findByUserId(adminId)).map((p) => p.project_id)).toContain(projectId)

    // 3) 이슈 생성
    const issueId = randomUUID()
    const created = await issueRepo.create({
      issueId,
      projectId,
      issueTitle: 'task',
      issueKey: 'FL-1',
      createdBy: adminId,
      assignedTo: adminId,
      issueStatus: 'backlog'
    })
    expect(created.issue_id).toBe(issueId)

    // 4) 조회 경로 3종 모두 신규 이슈를 본다
    expect((await issueRepo.findByProject(projectId)).map((i) => i.issue_id)).toEqual([issueId])
    expect((await issueRepo.findByAssignee(adminId)).map((i) => i.issue_id)).toEqual([issueId])
    expect((await issueRepo.findByUserProjects(adminId)).map((i) => i.issue_id)).toEqual([issueId])

    // 5) 수정
    const updated = await issueRepo.update(issueId, {
      issueTitle: 'task!',
      issueDesc: 'done desc',
      issueStatus: 'done',
      modifiedBy: adminId
    })
    expect(updated.issue_title).toBe('task!')
    expect(updated.issue_status).toBe('done')

    // 6) 삭제 → 모든 조회에서 사라진다
    await issueRepo.delete(issueId)
    expect(await issueRepo.findById(issueId)).toBeNull()
    expect(await issueRepo.findByAssignee(adminId)).toEqual([])
  })
})
