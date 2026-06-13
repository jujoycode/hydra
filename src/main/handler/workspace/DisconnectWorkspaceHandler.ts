import { CoreBaseHandler } from '@/base/CoreBaseHandler'
import { RepositoryContainer } from '@/database/RepositoryContainer'
import { IpcChannel } from '@/interface/CoreInterface'

export class DisconnectWorkspaceHandler extends CoreBaseHandler<IpcChannel.WORKSPACE_DISCONNECT> {
  constructor() {
    super(IpcChannel.WORKSPACE_DISCONNECT)
  }

  async handler() {
    await RepositoryContainer.getInstance().teardown()
    return { data: true, error: null }
  }
}
