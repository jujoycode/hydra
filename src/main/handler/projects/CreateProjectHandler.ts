import { IpcChannel, type CreateProjectParams, type projects } from '@interface/CoreInterface'
import { CoreBaseHandler } from '@base/CoreBaseHandler'
import { randomUUID } from 'crypto'
import { CoreDataBase } from '@database/CoreDataBase'

export class CreateProjectHandler extends CoreBaseHandler {
  constructor() {
    super(IpcChannel.PROJECT_CREATE)
  }

  async handler(params: CreateProjectParams): Promise<projects> {
    this.logDebug(`CreateProjectHandler Params: ${JSON.stringify(params)}`)

    // 1. 프로젝트 생성 전 체크 (중복명 체크, 프로젝트 수 체크)
    await CoreDataBase.checkCreateProjects(params.userId, params.projectName)

    // 2. 프로젝트 생성 (public.projects)
    return await this.getHydraDb()
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
  }
}
