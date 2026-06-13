import { CoreBaseHandler } from '@/base/CoreBaseHandler'
import { IpcChannel, type WorkspaceSaveParams } from '@/interface/CoreInterface'
import { WorkspaceManager } from '@/workspace/WorkspaceManager'

export class SaveWorkspaceHandler extends CoreBaseHandler<IpcChannel.WORKSPACE_SAVE> {
  constructor() {
    super(IpcChannel.WORKSPACE_SAVE)
  }

  async handler(params: WorkspaceSaveParams) {
    const workspace = WorkspaceManager.getInstance().add(params)
    return { data: workspace, error: null }
  }
}
