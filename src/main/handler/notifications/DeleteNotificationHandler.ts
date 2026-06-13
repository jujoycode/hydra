import { CoreBaseHandler } from '@/base/CoreBaseHandler'
import { type DeleteNotificationParams, IpcChannel } from '@/interface/CoreInterface'

export class DeleteNotificationHandler extends CoreBaseHandler<IpcChannel.NOTIFICATION_DELETE> {
  constructor() {
    super(IpcChannel.NOTIFICATION_DELETE)
  }

  async handler(params: DeleteNotificationParams) {
    const result = await this.repos.notifications.delete(params.notificationId)
    return { data: result, error: null }
  }
}
