import { CoreBaseHandler } from '@/base/CoreBaseHandler'
import { IpcChannel } from '@/interface/CoreInterface'

export class ListUsersHandler extends CoreBaseHandler<IpcChannel.AUTH_LIST_USERS> {
  constructor() {
    super(IpcChannel.AUTH_LIST_USERS)
  }

  async handler() {
    const users = await this.repos.users.findAll()
    return { data: users, error: null }
  }
}
