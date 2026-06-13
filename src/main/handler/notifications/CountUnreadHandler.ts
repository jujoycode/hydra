import { CoreBaseHandler } from '@/base/CoreBaseHandler'
import { type CountUnreadParams, IpcChannel } from '@/interface/CoreInterface'

export class CountUnreadHandler extends CoreBaseHandler<IpcChannel.NOTIFICATION_COUNT_UNREAD> {
  constructor() {
    super(IpcChannel.NOTIFICATION_COUNT_UNREAD)
  }

  async handler(params: CountUnreadParams) {
    const count = await this.repos.notifications.countUnread(params.userId)
    return { data: count, error: null }
  }
}
