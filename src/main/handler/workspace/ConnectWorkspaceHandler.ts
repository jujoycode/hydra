import type { NodePgDatabase } from 'drizzle-orm/node-postgres'
import { CoreBaseHandler } from '@/base/CoreBaseHandler'
import { PostgresAdapter } from '@/database/adapter/PostgresAdapter'
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
import type * as schema from '@/database/schema/drizzle/schema'
import { IpcChannel, type WorkspaceConnectParams } from '@/interface/CoreInterface'
import { CoreUtil } from '@/util/CoreUtil'

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

    const adapter = new PostgresAdapter()

    // PostgresAdapter.connect()는 실패 시 DatabaseError를 throw하며,
    // initHandler의 BaseError 브랜치가 이를 IPC 응답으로 변환해준다.
    await adapter.connect({
      host: params.host,
      port: params.port,
      database: params.dbName,
      user: params.username,
      password: params.password,
      sslCertPath: params.sslCertPath
    })

    // 스키마를 최신 마이그레이션으로 적용 (멱등)
    await adapter.runMigrations(getMigrationsFolder())

    const db = adapter.getConnection() as NodePgDatabase<typeof schema>
    const userRepo = new DrizzleUserRepository(db)
    const projectRepo = new DrizzleProjectRepository(db)
    const issueRepo = new DrizzleIssueRepository(db)
    const fileRepo = new DrizzleFileRepository(db)
    const commentRepo = new DrizzleCommentRepository(db)
    const labelRepo = new DrizzleLabelRepository(db)
    const milestoneRepo = new DrizzleMilestoneRepository(db)
    const taskRepo = new DrizzleTaskRepository(db)
    const issueRelationRepo = new DrizzleIssueRelationRepository(db)
    const notificationRepo = new DrizzleNotificationRepository(db)
    const integrationRepo = new DrizzleIntegrationRepository(db)

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

    let user = await userRepo.findByDbRole(params.username)
    const isFirstLogin = !user

    // 첫 연결 시 admin 유저 자동 생성
    if (isFirstLogin) {
      user = await userRepo.create({
        userId: CoreUtil.getUuid(),
        userName: params.username,
        userEmail: '',
        userDbRole: params.username,
        userRole: 'admin'
      })
    }

    return {
      data: {
        connected: true,
        user,
        isFirstLogin
      },
      error: null
    }
  }
}
