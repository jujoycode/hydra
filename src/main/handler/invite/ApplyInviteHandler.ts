import { CoreBaseHandler } from '@/base/CoreBaseHandler'
import { ErrorCode, type InviteApplyParams, type InviteCodeInfo, IpcChannel } from '@/interface/CoreInterface'

export class ApplyInviteHandler extends CoreBaseHandler<IpcChannel.INVITE_APPLY> {
  constructor() {
    super(IpcChannel.INVITE_APPLY)
  }

  async handler(params: InviteApplyParams) {
    const decoded = Buffer.from(params.code, 'base64').toString('utf-8')
    const info = JSON.parse(decoded) as InviteCodeInfo

    // 초대 코드 만료 확인
    if (info.expiresAt && new Date(info.expiresAt) < new Date()) {
      return {
        data: null,
        error: {
          code: ErrorCode.VALIDATION_ERROR,
          message: 'Invite code has expired',
          data: null
        }
      }
    }

    return { data: info, error: null }
  }
}
