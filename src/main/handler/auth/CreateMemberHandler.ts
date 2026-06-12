import { normalizeHandle } from '@/auth/normalize'
import { hashPassword } from '@/auth/password'
import { toSafeUser } from '@/auth/safeUser'
import { CoreBaseHandler } from '@/base/CoreBaseHandler'
import { type CreateMemberParams, IpcChannel } from '@/interface/CoreInterface'
import { CoreUtil } from '@/util/CoreUtil'

export class CreateMemberHandler extends CoreBaseHandler<IpcChannel.AUTH_CREATE_MEMBER> {
  constructor() {
    super(IpcChannel.AUTH_CREATE_MEMBER)
  }

  async handler(params: CreateMemberParams) {
    const passwordHash = await hashPassword(params.initialPassword)
    const user = await this.repos.users.create({
      userId: CoreUtil.getUuid(),
      userSn: normalizeHandle(params.userSn),
      passwordHash,
      userName: params.userName,
      userEmail: params.userEmail ? normalizeHandle(params.userEmail) : null,
      userRole: params.userRole ?? 'member'
    })
    return { data: toSafeUser(user), error: null }
  }
}
