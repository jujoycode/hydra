import { CoreBaseHandler } from '@/base/CoreBaseHandler'
import { IpcChannel, type ListNotificationsParams } from '@/interface/CoreInterface'

export class ListNotificationsHandler extends CoreBaseHandler<IpcChannel.NOTIFICATION_LIST> {
  constructor() {
    super(IpcChannel.NOTIFICATION_LIST)
  }

  async handler(params: ListNotificationsParams) {
    const notifications = await this.repos.notifications.findByUser(params.userId)
    return { data: notifications, error: null }
  }
}
