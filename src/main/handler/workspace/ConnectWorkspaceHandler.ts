import { CoreBaseHandler } from '@/base/CoreBaseHandler'
import { createAdapter } from '@/database/adapter/createAdapter'
import { getMigrationsFolder } from '@/database/migrate/migrationsPath'
import { RepositoryContainer } from '@/database/RepositoryContainer'
import {
  DrizzleCommentRepository,
  DrizzleFileRepository,
  DrizzleIntegrationRepository,
  DrizzleIssueRelationRepository,
  DrizzleIssueRepository,
  DrizzleLabelRepository,
  DrizzleMilestoneRepository,
  DrizzleNotificationRepository,
  DrizzleProjectRepository,
  DrizzleTaskRepository,
  DrizzleUserRepository
} from '@/database/repository/drizzle'
import type { DrizzleDb, DrizzleSchema } from '@/database/repository/drizzle/executor'
import * as pgSchema from '@/database/schema/drizzle/schema'
import * as mysqlSchema from '@/database/schema/drizzle/schema.mysql'
import { IpcChannel, type WorkspaceConnectParams } from '@/interface/CoreInterface'

export class ConnectWorkspaceHandler extends CoreBaseHandler<IpcChannel.WORKSPACE_CONNECT> {
  constructor() {
    super(IpcChannel.WORKSPACE_CONNECT)
  }

  async handler(params: WorkspaceConnectParams) {
    // 기존 연결이 있으면 정리
    const container = RepositoryContainer.getInstance()
    if (container.isInitialized) {
      await container.teardown()
    }

    const dbms = params.dbms ?? 'postgresql'
    const adapter = createAdapter(dbms)

    // adapter.connect()는 실패 시 DatabaseError를 throw하며,
    // initHandler의 BaseError 브랜치가 이를 IPC 응답으로 변환해준다.
    await adapter.connect({
      host: params.host,
      port: params.port,
      database: params.dbName,
      user: params.username,
      password: params.password,
      sslCertPath: params.sslCertPath
    })

    // 스키마를 최신 마이그레이션으로 적용 (멱등) — dialect별 폴더
    await adapter.runMigrations(getMigrationsFolder(dbms === 'mysql' ? 'mysql' : 'pg'))

    // 단일 리포지토리 셋: 타입 기준은 pg, MySQL은 구조 호환 캐스트 (executor.ts 참고)
    const db = adapter.getConnection() as unknown as DrizzleDb
    const schemaSet: DrizzleSchema = dbms === 'mysql' ? (mysqlSchema as unknown as DrizzleSchema) : pgSchema

    const userRepo = new DrizzleUserRepository(db, schemaSet)
    const projectRepo = new DrizzleProjectRepository(db, schemaSet)
    const issueRepo = new DrizzleIssueRepository(db, schemaSet)
    const fileRepo = new DrizzleFileRepository(db, schemaSet)
    const commentRepo = new DrizzleCommentRepository(db, schemaSet)
    const labelRepo = new DrizzleLabelRepository(db, schemaSet)
    const milestoneRepo = new DrizzleMilestoneRepository(db, schemaSet)
    const taskRepo = new DrizzleTaskRepository(db, schemaSet)
    const issueRelationRepo = new DrizzleIssueRelationRepository(db, schemaSet)
    const notificationRepo = new DrizzleNotificationRepository(db, schemaSet)
    const integrationRepo = new DrizzleIntegrationRepository(db, schemaSet)

    container.initialize(
      adapter,
      userRepo,
      projectRepo,
      issueRepo,
      fileRepo,
      commentRepo,
      labelRepo,
      milestoneRepo,
      taskRepo,
      issueRelationRepo,
      notificationRepo,
      integrationRepo
    )

    // Phase 3: 연결 시 자동 admin 생성 제거. users 비어있으면 setup 필요.
    const userCount = await userRepo.count()

    return {
      data: {
        connected: true,
        needsSetup: userCount === 0
      },
      error: null
    }
  }
}
