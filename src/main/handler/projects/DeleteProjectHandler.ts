import { IpcChannel, type DeleteProjectParams } from '@interface/CoreInterface'
import { CoreBaseHandler } from '@base/CoreBaseHandler'

export class DeleteProjectHandler extends CoreBaseHandler {
  constructor() {
    super(IpcChannel.PROJECT_DELETE)
  }

  async handler(params: DeleteProjectParams): Promise<boolean> {
    this.logDebug(`DeleteProjectHandler Params: ${JSON.stringify(params)}`)

    try {
      await this.getHydraDb().$transaction([
        // 1. 사용자 프로젝트 관계 삭제 (public.users_projects_link)
        this.getHydraDb().users_projects_link.delete({
          where: {
            // TODO: 무조건 PK로만 삭제가 가능한건지?
            user_project_link_id: params.projectId
          }
        }),

        // 2. 프로젝트 삭제 (public.projects)
        this.getHydraDb().projects.delete({
          where: {
            project_id: params.projectId
          }
        })
      ])

      return true
    } catch (error) {
      console.error('DeleteProjectHandler Error:', error)
      return false
    }
  }
}
