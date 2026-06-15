import { CoreBaseHandler } from '@/base/CoreBaseHandler'
import { IpcChannel, type ListActivityParams } from '@/interface/CoreInterface'

export class ListActivityHandler extends CoreBaseHandler<IpcChannel.ACTIVITY_LIST> {
  constructor() {
    super(IpcChannel.ACTIVITY_LIST)
  }

  async handler(params: ListActivityParams) {
    const activities = await this.repos.activityLogs.findByEntity(params.entityType, params.entityId)
    return { data: activities, error: null }
  }
}
