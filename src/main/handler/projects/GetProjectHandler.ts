import { CoreBaseHandler } from '@/base/CoreBaseHandler'
import { ErrorCode, type GetProjectParams, IpcChannel } from '@/interface/CoreInterface'

export class GetProjectHandler extends CoreBaseHandler<IpcChannel.PROJECT_GET> {
  constructor() {
    super(IpcChannel.PROJECT_GET)
  }

  async handler(params: GetProjectParams) {
    const project = await this.repos.projects.findById(params.projectId)
    if (!project) {
      return { data: null, error: { code: ErrorCode.NOT_FOUND_ERROR, message: 'Project not found', data: null } }
    }
    return { data: project, error: null }
  }
}
