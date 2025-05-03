import { randomUUID } from 'crypto'
import { CoreBaseHandler } from '@/base/CoreBaseHandler'
import { ProjectValidator } from '@/util/validator'
import { OperationFailedError } from '@/error/OperationFailedError'
import { IpcChannel, type CreateProjectParams } from '@/interface/CoreInterface'

export class CreateProjectHandler extends CoreBaseHandler<IpcChannel.PROJECT_CREATE, ProjectValidator> {
  constructor() {
    super(IpcChannel.PROJECT_CREATE, ProjectValidator)
  }

  async handler(params: CreateProjectParams) {
    this.logDebug(`CreateProjectHandler Params: ${JSON.stringify(params)}`)

    // 1. 프로젝트 생성 전 유효성 검사 (중복명 체크, 프로젝트 키 체크, 프로젝트 수 체크)
    await this.validator?.checkCreateProject(params.userId, params.projectName, params.projectKey)

    // 2. 프로젝트 생성 (public.projects)
    const projectId = randomUUID()

    try {
      const project = await this.getHydraDb().$transaction(async (tx) => {
        const project = await tx.projects.create({
          data: {
            project_id: projectId,
            project_name: params.projectName,
            project_key: params.projectKey,
            project_desc: params.projectDesc,
            project_created_by: params.userId,
            project_modified_by: params.userId,
            project_start_date: new Date(),
            project_end_date: new Date()
          }
        })

        // 사용자-프로젝트 연결 생성
        await tx.users_projects_link.create({
          data: {
            user_project_link_id: randomUUID(),
            user_id: params.userId,
            project_id: project.project_id
          }
        })

        return project
      })

      return { data: project, error: null }
    } catch (txError: any) {
      this.logError(`[CreateProjectHandler] Transaction Error: ${txError.message}`)
      this.logError(`[CreateProjectHandler] Error Stack: ${txError.stack}`)

      // 유효성 검사에서 잡지 못한 DB 수준의 에러 처리
      throw new OperationFailedError(`Failed to create project with user link: ${txError.message}`)
    }
  }
}
