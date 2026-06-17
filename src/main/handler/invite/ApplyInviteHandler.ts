import { CoreBaseHandler } from '@/base/CoreBaseHandler'
import { ValidationError } from '@/error/ValidationError'
import { type InviteApplyParams, type InviteCodeInfo, IpcChannel } from '@/interface/CoreInterface'

export class ApplyInviteHandler extends CoreBaseHandler<IpcChannel.INVITE_APPLY> {
  constructor() {
    super(IpcChannel.INVITE_APPLY)
  }

  async handler(params: InviteApplyParams) {
    const decoded = Buffer.from(params.code, 'base64').toString('utf-8')
    const info = JSON.parse(decoded) as InviteCodeInfo

    // Phase 4 이전에 발급된 초대 코드에는 dbms가 없다 → postgresql로 백필
    info.dbms = info.dbms === 'mysql' ? 'mysql' : 'postgresql'

    // 초대 코드 만료 확인
    if (info.expiresAt && new Date(info.expiresAt) < new Date()) {
      throw new ValidationError('Invite code has expired', null)
    }

    return { data: info, error: null }
  }
}
