import { toSafeUser } from '@/auth/safeUser'
import { CoreBaseHandler } from '@/base/CoreBaseHandler'
import { type AuthUpdateUserParams, IpcChannel } from '@/interface/CoreInterface'

export class UpdateUserHandler extends CoreBaseHandler<IpcChannel.AUTH_UPDATE_USER> {
  constructor() {
    super(IpcChannel.AUTH_UPDATE_USER)
  }

  async handler(params: AuthUpdateUserParams) {
    const user = await this.repos.users.update(params.userId, {
      userName: params.userName,
      userAvatarPath: params.userAvatarKey ?? null
    })
    return { data: toSafeUser(user), error: null }
  }
}
