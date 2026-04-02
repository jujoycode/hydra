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
      return {
        data: {
          connected: false,
          user: null,
          isFirstLogin: false
        },
        error: null
      }
    }

    return {
      data: {
        connected: true,
        user: null,
        isFirstLogin: false
      },
      error: null
    }
  }
}
