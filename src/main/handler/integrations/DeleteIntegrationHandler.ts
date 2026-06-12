import { CoreBaseHandler } from '@/base/CoreBaseHandler'
import { type DeleteIntegrationParams, IpcChannel } from '@/interface/CoreInterface'

export class DeleteIntegrationHandler extends CoreBaseHandler<IpcChannel.INTEGRATION_DELETE> {
  constructor() {
    super(IpcChannel.INTEGRATION_DELETE)
  }

  async handler(params: DeleteIntegrationParams) {
    const result = await this.repos.integrations.delete(params.integrationId)
    return { data: result, error: null }
  }
}
