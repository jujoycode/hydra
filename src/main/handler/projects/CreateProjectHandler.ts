import { randomUUID } from 'crypto'
import { CoreBaseHandler } from '@base/CoreBaseHandler'
import { ProjectValidator } from '@util/validator'
import { IpcChannel, type CreateProjectParams } from '@interface/CoreInterface'

export class CreateProjectHandler extends CoreBaseHandler<IpcChannel.PROJECT_CREATE, ProjectValidator> {
  constructor() {
    super(IpcChannel.PROJECT_CREATE, ProjectValidator)
  }

  async handler(params: CreateProjectParams) {
    this.logDebug(`CreateProjectHandler Params: ${JSON.stringify(params)}`)

    // 1. 프로젝트 생성 전 체크 (중복명 체크, 프로젝트 수 체크)
    await this.validator?.checkCreateProject(params.userId, params.projectName)

    // 2. 프로젝트 생성 (public.projects)
    const project = await this.getHydraDb()
      .$transaction(async (tx) => {
        const project = await tx.projects.create({
          data: {
            project_id: randomUUID(),
            project_name: params.projectName,
            project_desc: params.projectDescription,
            project_created_by: params.userId,
            project_modified_by: params.userId,
            project_start_date: new Date(),
            project_end_date: new Date()
          }
        })

        // 2. 프로젝트와 사용자 연관 관계 생성 (public.users_projects_link)
        await tx.users_projects_link.create({
          data: {
            user_project_link_id: randomUUID(),
            user_id: params.userId,
            project_id: project.project_id
          }
        })

        return project
      })
      .catch((err) => {
        const error = err as Error
        throw new Error(`Failed to create project with user link: ${error.message}`)
      })

    return { data: project, error: null }
  }
}
