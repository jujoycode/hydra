import { CoreBaseHandler } from '@/base/CoreBaseHandler'
import { type CreateMemberParams, IpcChannel } from '@/interface/CoreInterface'
import { CoreUtil } from '@/util/CoreUtil'

export class CreateMemberHandler extends CoreBaseHandler<IpcChannel.AUTH_CREATE_MEMBER> {
  constructor() {
    super(IpcChannel.AUTH_CREATE_MEMBER)
  }

  async handler(params: CreateMemberParams) {
    // 1. DB 역할 생성
    await this.repos.db.createRole(params.dbRoleName, params.dbPassword)

    // 2. 사용자 레코드 생성
    const user = await this.repos.users.create({
      userId: CoreUtil.getUuid(),
      userName: params.userName,
      userEmail: params.userEmail,
      userDbRole: params.dbRoleName,
      userRole: params.userRole ?? 'member'
    })

    return { data: user, error: null }
  }
}
