import { CoreBaseHandler } from '@/base/CoreBaseHandler'
import { IpcChannel, type WorkspaceDeleteParams } from '@/interface/CoreInterface'
import { WorkspaceManager } from '@/workspace/WorkspaceManager'

export class DeleteWorkspaceHandler extends CoreBaseHandler<IpcChannel.WORKSPACE_DELETE> {
  constructor() {
    super(IpcChannel.WORKSPACE_DELETE)
  }

  async handler(params: WorkspaceDeleteParams) {
    const removed = WorkspaceManager.getInstance().remove(params.workspaceId)
    return { data: removed, error: null }
  }
}
