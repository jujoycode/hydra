import { CoreBaseHandler } from '@/base/CoreBaseHandler'
import { IpcChannel } from '@/interface/CoreInterface'
import { WorkspaceManager } from '@/workspace/WorkspaceManager'

export class ListWorkspacesHandler extends CoreBaseHandler<IpcChannel.WORKSPACE_LIST> {
  constructor() {
    super(IpcChannel.WORKSPACE_LIST)
  }

  async handler() {
    const workspaces = WorkspaceManager.getInstance().getAll()
    return { data: workspaces, error: null }
  }
}
