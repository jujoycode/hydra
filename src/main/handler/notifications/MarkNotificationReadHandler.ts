import { CoreBaseHandler } from '@/base/CoreBaseHandler'
import { IpcChannel, type MarkNotificationReadParams } from '@/interface/CoreInterface'

export class MarkNotificationReadHandler extends CoreBaseHandler<IpcChannel.NOTIFICATION_MARK_READ> {
  constructor() {
    super(IpcChannel.NOTIFICATION_MARK_READ)
  }

  async handler(params: MarkNotificationReadParams) {
    const notification = await this.repos.notifications.markAsRead(params.notificationId)
    return { data: notification, error: null }
  }
}
