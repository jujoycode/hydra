import { CoreBaseHandler } from '@/base/CoreBaseHandler'
import { IpcChannel, type SaveIntegrationParams } from '@/interface/CoreInterface'
import { CoreUtil } from '@/util/CoreUtil'

export class SaveIntegrationHandler extends CoreBaseHandler<IpcChannel.INTEGRATION_SAVE> {
  constructor() {
    super(IpcChannel.INTEGRATION_SAVE)
  }

  async handler(params: SaveIntegrationParams) {
    const existing = await this.repos.integrations.findByType(params.integrationType)
    if (existing) {
      const updated = await this.repos.integrations.update(existing.integration_id, {
        integrationConfig: params.integrationConfig,
        integrationEnabled: params.integrationEnabled
      })
      return { data: updated, error: null }
    }
    const created = await this.repos.integrations.create({
      integrationId: CoreUtil.getUuid(),
      integrationType: params.integrationType,
      integrationConfig: params.integrationConfig,
      integrationEnabled: params.integrationEnabled
    })
    return { data: created, error: null }
  }
}
