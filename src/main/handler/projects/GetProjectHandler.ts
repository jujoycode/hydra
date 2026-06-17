import { CoreBaseHandler } from '@/base/CoreBaseHandler'
import { NotFoundError } from '@/error/NotFoundError'
import { type GetProjectParams, IpcChannel } from '@/interface/CoreInterface'

export class GetProjectHandler extends CoreBaseHandler<IpcChannel.PROJECT_GET> {
  constructor() {
    super(IpcChannel.PROJECT_GET)
  }

  async handler(params: GetProjectParams) {
    const project = await this.repos.projects.findById(params.projectId)
    if (!project) {
      throw new NotFoundError('Project not found')
    }
    return { data: project, error: null }
  }
}
