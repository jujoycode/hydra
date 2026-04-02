import { CoreBaseHandler } from '@/base/CoreBaseHandler'
import { type AuthUpdateUserParams, IpcChannel } from '@/interface/CoreInterface'

/**
 * 사용자 정보를 업데이트하는 핸들러 클래스입니다
 * @extends CoreBaseHandler
 */
export class UpdateUserHandler extends CoreBaseHandler<IpcChannel.AUTH_UPDATE_USER> {
  constructor() {
    super(IpcChannel.AUTH_UPDATE_USER)
  }

  /**
   * 사용자 정보를 업데이트합니다
   */
  async handler(params: AuthUpdateUserParams) {
    // 사용자 정보 업데이트 (public.users)
    const user = await this.repos.users.update(params.userId, {
      userName: params.userName,
      userAvatarPath: params.userAvatarKey ?? null
    })

    return { data: user, error: null }
  }
}
