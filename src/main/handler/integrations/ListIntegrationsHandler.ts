import { CoreBaseHandler } from '@/base/CoreBaseHandler'
import { IpcChannel } from '@/interface/CoreInterface'

export class ListIntegrationsHandler extends CoreBaseHandler<IpcChannel.INTEGRATION_LIST> {
  constructor() {
    super(IpcChannel.INTEGRATION_LIST)
  }

  async handler() {
    const integrations = await this.repos.integrations.findAll()
    return { data: integrations, error: null }
  }
}
