import { randomUUID } from 'node:crypto'
import { resolve } from 'node:path'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { createMySqlTestDatabase, dropMySqlTestDatabase, mysqlTestConfig } from './__testutils__/mysqlTestDb'
import { MySqlAdapter } from './adapter/MySqlAdapter'
import { DrizzleIssueRepository } from './repository/drizzle/DrizzleIssueRepository'
import { DrizzleProjectRepository } from './repository/drizzle/DrizzleProjectRepository'
import { DrizzleUserRepository } from './repository/drizzle/DrizzleUserRepository'
import type { DrizzleDb, DrizzleSchema } from './repository/drizzle/executor'
import * as mysqlSchema from './schema/drizzle/schema.mysql'

describe.runIf(process.env.RUN_DB_TESTS_MYSQL === '1')('MySQL cross-engine integration', () => {
  let adapter: MySqlAdapter
  let dbName: string
  let db: DrizzleDb
  let schema: DrizzleSchema

  beforeAll(async () => {
    dbName = await createMySqlTestDatabase()
    adapter = new MySqlAdapter()
    await adapter.connect({ ...mysqlTestConfig(), database: dbName })
    await adapter.runMigrations(resolve(process.cwd(), 'drizzle/mysql'))
    db = adapter.getConnection() as unknown as DrizzleDb
    schema = mysqlSchema as unknown as DrizzleSchema
  }, 30000)

  afterAll(async () => {
    try {
      await adapter.disconnect()
    } finally {
      if (dbName) await dropMySqlTestDatabase(dbName)
    }
  }, 30000)

  // ── 1. read-after-write: 리포지토리 경유 create() RETURNING 없이 삽입 행 반환 ──────
  it('create() returns the inserted row without RETURNING (project + issue)', async () => {
    const userRepo = new DrizzleUserRepository(db, schema)
    const projectRepo = new DrizzleProjectRepository(db, schema)
    const issueRepo = new DrizzleIssueRepository(db, schema)

    const userId = randomUUID()
    const user = await userRepo.create({
      userId,
      userSn: userId,
      passwordHash: 'test-hash',
      userName: 'tester',
      userRole: 'admin'
    })
    expect(user.user_id).toBe(userId)

    const projectId = randomUUID()
    // project_key: varchar(50) — UUID 앞 8자리만 사용
    const project = await projectRepo.create({
      projectId,
      projectName: 'MySQLProject',
      projectKey: `PK-${projectId.slice(0, 8)}`,
      createdBy: userId,
      startDate: new Date(),
      endDate: new Date()
    })
    expect(project.project_id).toBe(projectId)
    expect(project.project_name).toBe('MySQLProject')

    const issueId = randomUUID()
    const issue = await issueRepo.create({
      issueId,
      projectId,
      issueTitle: 'mysql-issue',
      issueKey: `I-${issueId.slice(0, 8)}`,
      createdBy: userId
    })
    expect(issue.issue_id).toBe(issueId)
    expect(issue.issue_title).toBe('mysql-issue')
  }, 30000)

  // ── 2. update read-after-write: update() 갱신된 행 반환 ──────────────────────────
  it('update() returns the updated user row', async () => {
    const userRepo = new DrizzleUserRepository(db, schema)

    const userId = randomUUID()
    await userRepo.create({
      userId,
      userSn: `sn-${userId}`,
      passwordHash: 'hash2',
      userName: 'before',
      userRole: 'member'
    })

    const updated = await userRepo.update(userId, { userName: 'after' })
    expect(updated.user_name).toBe('after')
    expect(updated.user_id).toBe(userId)
  }, 30000)

  // ── 3. 트랜잭션 원자성: throw 시 롤백 ────────────────────────────────────────────
  it('rolls back the project insert when a later write throws', async () => {
    const userRepo = new DrizzleUserRepository(db, schema)
    const projectRepo = new DrizzleProjectRepository(db, schema)

    const userId = randomUUID()
    await userRepo.create({
      userId,
      userSn: `sn-tx-${userId}`,
      passwordHash: 'hash3',
      userName: 'tx-tester',
      userRole: 'admin'
    })

    const projectId = randomUUID()
    await expect(
      adapter.transaction(async (tx) => {
        await projectRepo.create(
          {
            projectId,
            projectName: 'RollbackProject',
            projectKey: `RB-${projectId.slice(0, 8)}`,
            createdBy: userId,
            startDate: new Date(),
            endDate: new Date()
          },
          tx
        )
        throw new Error('boom') // create 이후 강제 롤백
      })
    ).rejects.toThrow('boom')

    const found = await projectRepo.findById(projectId)
    expect(found).toBeNull()
  }, 30000)

  // ── 4. UTC datetime(3) 라운드트립 ────────────────────────────────────────────────
  it('stores created_at as a Date instance within 60 s of now (UTC datetime(3) round-trip)', async () => {
    const userRepo = new DrizzleUserRepository(db, schema)
    const issueRepo = new DrizzleIssueRepository(db, schema)
    const projectRepo = new DrizzleProjectRepository(db, schema)

    const userId = randomUUID()
    const user = await userRepo.create({
      userId,
      userSn: `sn-dt-${userId}`,
      passwordHash: 'hash4',
      userName: 'dt-tester',
      userRole: 'member'
    })
    expect(user.user_created_at).toBeInstanceOf(Date)
    expect(Math.abs(Date.now() - user.user_created_at!.getTime())).toBeLessThan(60_000)

    const projectId = randomUUID()
    await projectRepo.create({
      projectId,
      projectName: 'DT-Project',
      projectKey: `DT-${projectId.slice(0, 8)}`,
      createdBy: userId
    })

    const issueId = randomUUID()
    const issue = await issueRepo.create({
      issueId,
      projectId,
      issueTitle: 'dt-issue',
      issueKey: `DI-${issueId.slice(0, 8)}`,
      createdBy: userId
    })
    expect(issue.issue_created_at).toBeInstanceOf(Date)
    expect(Math.abs(Date.now() - issue.issue_created_at!.getTime())).toBeLessThan(60_000)
  }, 30000)

  // ── 5. 대소문자 무시 검색 (caseInsensitiveLike) ───────────────────────────────────
  it('findByProjectFiltered() matches lowercase data with uppercase search term', async () => {
    const userRepo = new DrizzleUserRepository(db, schema)
    const projectRepo = new DrizzleProjectRepository(db, schema)
    const issueRepo = new DrizzleIssueRepository(db, schema)

    const userId = randomUUID()
    await userRepo.create({
      userId,
      userSn: `sn-ci-${userId}`,
      passwordHash: 'hash5',
      userName: 'ci-tester',
      userRole: 'admin'
    })

    const projectId = randomUUID()
    await projectRepo.create({
      projectId,
      projectName: 'CI-Project',
      projectKey: `CI-${projectId.slice(0, 8)}`,
      createdBy: userId
    })

    await issueRepo.create({
      issueId: randomUUID(),
      projectId,
      issueTitle: 'findme bug',
      issueKey: `CI1-${projectId.slice(0, 6)}`,
      createdBy: userId
    })

    const res = await issueRepo.findByProjectFiltered(projectId, { search: 'FINDME' })
    expect(res.total).toBe(1)
    expect(res.data[0].issue_title).toBe('findme bug')
  }, 30000)

  // ── 7. advisory lock 트랜잭션: SetupAdminHandler 경로 (PG pg_advisory_xact_lock 대신 MySQL GET_LOCK) ──
  // 회귀: 과거 SetupAdminHandler가 PG 전용 pg_advisory_xact_lock을 직접 실행해 MySQL에서
  // errno 1305(FUNCTION does not exist)로 깨졌다. 어댑터가 다이얼렉트별 락을 캡슐화하는지 검증.
  it('transactionWithAdvisoryLock runs the callback in a real tx without pg_advisory_xact_lock', async () => {
    const userRepo = new DrizzleUserRepository(db, schema)
    const userId = randomUUID()

    const created = await adapter.transactionWithAdvisoryLock(481975, async (tx) => {
      const u = await userRepo.create(
        {
          userId,
          userSn: `sn-lock-${userId}`,
          passwordHash: 'lockhash',
          userName: 'lock-tester',
          userRole: 'admin'
        },
        tx
      )
      return u
    })

    expect(created.user_id).toBe(userId)
    expect(await userRepo.findById(userId)).not.toBeNull()
  }, 30000)

  // ── 8. advisory lock 트랜잭션 롤백: 콜백 throw 시 임계구역 쓰기가 롤백된다 ────────────
  it('transactionWithAdvisoryLock rolls back the insert when the callback throws', async () => {
    const userRepo = new DrizzleUserRepository(db, schema)
    const userId = randomUUID()

    await expect(
      adapter.transactionWithAdvisoryLock(481975, async (tx) => {
        await userRepo.create(
          {
            userId,
            userSn: `sn-lock-rb-${userId}`,
            passwordHash: 'lockhash2',
            userName: 'lock-rollback',
            userRole: 'admin'
          },
          tx
        )
        throw new Error('boom-in-lock')
      })
    ).rejects.toThrow('boom-in-lock')

    expect(await userRepo.findById(userId)).toBeNull()
  }, 30000)

  // ── 9. 와일드카드 리터럴 매치: '%'가 LIKE 와일드카드가 아닌 리터럴로 처리됨 ──────────
  it('findByProjectFiltered() treats "%" in search term as a literal character, not a wildcard', async () => {
    const userRepo = new DrizzleUserRepository(db, schema)
    const projectRepo = new DrizzleProjectRepository(db, schema)
    const issueRepo = new DrizzleIssueRepository(db, schema)

    const userId = randomUUID()
    await userRepo.create({
      userId,
      userSn: `sn-wc-${userId}`,
      passwordHash: 'hash6',
      userName: 'wc-tester',
      userRole: 'admin'
    })

    const projectId = randomUUID()
    await projectRepo.create({
      projectId,
      projectName: 'WC-Project',
      projectKey: `WC-${projectId.slice(0, 8)}`,
      createdBy: userId
    })

    // 첫 번째: '%'가 포함된 제목 — 검색어와 리터럴 일치
    await issueRepo.create({
      issueId: randomUUID(),
      projectId,
      issueTitle: 'progress 50% done',
      issueKey: `WC1-${projectId.slice(0, 6)}`,
      createdBy: userId
    })

    // 두 번째: '%' 대신 'X' — 검색어와 불일치해야 함
    await issueRepo.create({
      issueId: randomUUID(),
      projectId,
      issueTitle: 'progress 50X done',
      issueKey: `WC2-${projectId.slice(0, 6)}`,
      createdBy: userId
    })

    const res = await issueRepo.findByProjectFiltered(projectId, { search: '50% done' })
    expect(res.total).toBe(1)
    expect(res.data[0].issue_title).toBe('progress 50% done')
  }, 30000)
})
