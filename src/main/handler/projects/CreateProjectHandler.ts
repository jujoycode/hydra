import { CoreBaseHandler } from '@/base/CoreBaseHandler'
import { OperationFailedError } from '@/error/OperationFailedError'
import { type CreateProjectParams, IpcChannel } from '@/interface/CoreInterface'
import { CoreUtil } from '@/util/CoreUtil'
import { ProjectValidator } from '@/util/validator'

export class CreateProjectHandler extends CoreBaseHandler<IpcChannel.PROJECT_CREATE, ProjectValidator> {
  constructor() {
    super(IpcChannel.PROJECT_CREATE, ProjectValidator)
  }

  async handler(params: CreateProjectParams) {
    // 1. 프로젝트 생성 전 유효성 검사 (중복명 체크, 프로젝트 키 체크, 프로젝트 수 체크)
    await this.validator?.checkCreateProject(params.userId, params.projectName, params.projectKey)

    // 2. 프로젝트 생성 (public.projects)
    const projectId = CoreUtil.getUuid()

    try {
      const project = await this.repos.db.transaction(async (tx) => {
        const project = await this.repos.projects.create(
          {
            projectId,
            projectName: params.projectName,
            projectKey: params.projectKey,
            projectDesc: params.projectDesc,
            createdBy: params.userId,
            startDate: new Date(),
            endDate: new Date()
          },
          tx
        )

        // 사용자-프로젝트 연결 생성 (동일 트랜잭션)
        await this.repos.projects.linkUser(CoreUtil.getUuid(), params.userId, project.project_id, tx)

        return project
      })

      return { data: project, error: null }
    } catch (txError: unknown) {
      const message = txError instanceof Error ? txError.message : String(txError)
      this.logError(`[CreateProjectHandler] Transaction Error: ${message}`)

      // 유효성 검사에서 잡지 못한 DB 수준의 에러 처리
      throw new OperationFailedError(`Failed to create project with user link: ${message}`)
    }
  }
}
