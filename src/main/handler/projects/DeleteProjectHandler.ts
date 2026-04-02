import { CoreBaseHandler } from '@/base/CoreBaseHandler'
import { type DeleteProjectParams, IpcChannel } from '@/interface/CoreInterface'

export class DeleteProjectHandler extends CoreBaseHandler<IpcChannel.PROJECT_DELETE> {
  constructor() {
    super(IpcChannel.PROJECT_DELETE)
  }

  // ? 프로젝트 생성자만 삭제 가능해야함, 유예 기간 14일 존재해야함?
  // ? 유예 기간 후에 어떻게 삭제할지 고민 필요 (Batch X)
  async handler(params: DeleteProjectParams) {
    // 1. 사용자 프로젝트 관계 삭제 (public.users_projects_link)
    await this.repos.projects.unlinkUser(params.userId, params.projectId)

    // 2. 프로젝트 삭제 (public.projects)
    const result = await this.repos.projects.delete(params.projectId)

    return { data: result, error: null }
  }
}
