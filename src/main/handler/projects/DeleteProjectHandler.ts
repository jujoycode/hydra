import { IpcChannel, type DeleteProjectParams } from '@/interface/CoreInterface'
import { CoreBaseHandler } from '@/base/CoreBaseHandler'

export class DeleteProjectHandler extends CoreBaseHandler<IpcChannel.PROJECT_DELETE> {
  constructor() {
    super(IpcChannel.PROJECT_DELETE)
  }

  // ? 프로젝트 생성자만 삭제 가능해야함, 유예 기간 14일 존재해야함?
  // ? 유예 기간 후에 어떻게 삭제할지 고민 필요 (Batch X)
  async handler(params: DeleteProjectParams) {
    this.logDebug(`DeleteProjectHandler Params: ${JSON.stringify(params)}`)

    const project = await this.getHydraDb().$transaction([
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

    return { data: project ? true : false, error: null }
  }
}
