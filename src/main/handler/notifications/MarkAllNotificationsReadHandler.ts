import { CoreBaseHandler } from '@/base/CoreBaseHandler'
import { IpcChannel, type MarkAllNotificationsReadParams } from '@/interface/CoreInterface'

export class MarkAllNotificationsReadHandler extends CoreBaseHandler<IpcChannel.NOTIFICATION_MARK_ALL_READ> {
  constructor() {
    super(IpcChannel.NOTIFICATION_MARK_ALL_READ)
  }

  async handler(params: MarkAllNotificationsReadParams) {
    const result = await this.repos.notifications.markAllAsRead(params.userId)
    return { data: result, error: null }
  }
}
