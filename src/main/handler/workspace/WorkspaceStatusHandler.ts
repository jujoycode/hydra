import { CoreBaseHandler } from '@/base/CoreBaseHandler'
import { RepositoryContainer } from '@/database/RepositoryContainer'
import { IpcChannel } from '@/interface/CoreInterface'

export class WorkspaceStatusHandler extends CoreBaseHandler<IpcChannel.WORKSPACE_STATUS> {
  constructor() {
    super(IpcChannel.WORKSPACE_STATUS)
  }

  async handler() {
    const container = RepositoryContainer.getInstance()
    if (!container.isInitialized) {
      return { data: { connected: false, needsSetup: false }, error: null }
    }
    const count = await container.users.count()
    return { data: { connected: true, needsSetup: count === 0 }, error: null }
  }
}
