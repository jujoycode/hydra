import { CoreBaseHandler } from '@/base/CoreBaseHandler'
import { type AuthDeleteUserParams, IpcChannel } from '@/interface/CoreInterface'

export class DeleteUserHandler extends CoreBaseHandler<IpcChannel.AUTH_DELETE_USER> {
  constructor() {
    super(IpcChannel.AUTH_DELETE_USER)
  }

  async handler(params: AuthDeleteUserParams) {
    await this.repos.users.delete(params.id)
    return { data: null, error: null }
  }
}
