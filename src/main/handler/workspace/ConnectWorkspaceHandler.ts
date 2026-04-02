import type { NodePgDatabase } from 'drizzle-orm/node-postgres'
import { CoreBaseHandler } from '@/base/CoreBaseHandler'
import { PostgresAdapter } from '@/database/adapter/PostgresAdapter'
import { RepositoryContainer } from '@/database/RepositoryContainer'
import {
  DrizzleCommentRepository,
  DrizzleFileRepository,
  DrizzleIssueRelationRepository,
  DrizzleIssueRepository,
  DrizzleLabelRepository,
  DrizzleMilestoneRepository,
  DrizzleProjectRepository,
  DrizzleTaskRepository,
  DrizzleUserRepository
} from '@/database/repository/drizzle'
import type * as schema from '@/database/schema/drizzle/schema'
import { ErrorCode, IpcChannel, type WorkspaceConnectParams } from '@/interface/CoreInterface'
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

    try {
      await adapter.connect({
        host: params.host,
        port: params.port,
        database: params.dbName,
        user: params.username,
        password: params.password,
        sslCertPath: params.sslCertPath
      })
    } catch (error: unknown) {
      const pgCode = (error as { code?: string }).code
      if (pgCode === '28P01' || pgCode === '28000') {
        return { data: null, error: { code: ErrorCode.AUTH_ERROR, message: 'Authentication failed. Please check your username and password.', data: null } }
      }
      if (pgCode === 'ECONNREFUSED') {
        return { data: null, error: { code: ErrorCode.NETWORK_ERROR, message: `Cannot connect to database server at ${params.host}:${params.port}. Please check if the server is running.`, data: null } }
      }
      if (pgCode === 'ENOTFOUND') {
        return { data: null, error: { code: ErrorCode.NETWORK_ERROR, message: `Host "${params.host}" not found. Please check the hostname.`, data: null } }
      }
      if (pgCode === '3D000') {
        return { data: null, error: { code: ErrorCode.DB_ERROR, message: `Database "${params.dbName}" does not exist.`, data: null } }
      }
      return { data: null, error: { code: ErrorCode.DB_ERROR, message: error instanceof Error ? error.message : 'Failed to connect to database.', data: null } }
    }

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

    container.initialize(adapter, userRepo, projectRepo, issueRepo, fileRepo, commentRepo, labelRepo, milestoneRepo, taskRepo, issueRelationRepo)

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
