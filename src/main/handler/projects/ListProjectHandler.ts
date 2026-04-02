import { CoreBaseHandler } from '@/base/CoreBaseHandler'
import { IpcChannel, type ListProjectParams } from '@/interface/CoreInterface'

export class ListProjectHandler extends CoreBaseHandler<IpcChannel.PROJECT_LIST> {
  constructor() {
    super(IpcChannel.PROJECT_LIST)
  }

  async handler(params: ListProjectParams) {
    const projects = await this.repos.projects.findByUserId(params.userId)
    return { data: projects, error: null }
  }
}
