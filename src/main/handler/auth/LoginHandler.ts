import { normalizeHandle } from '@/auth/normalize'
import { verifyPassword } from '@/auth/password'
import { SessionManager } from '@/auth/SessionManager'
import { toSafeUser } from '@/auth/safeUser'
import { createSessionRecord } from '@/auth/session'
import { CoreBaseHandler } from '@/base/CoreBaseHandler'
import { DatabaseError } from '@/error/DatabaseError'
import { ErrorCode, IpcChannel, type LoginParams } from '@/interface/CoreInterface'

export class LoginHandler extends CoreBaseHandler<IpcChannel.AUTH_LOGIN> {
  constructor() {
    super(IpcChannel.AUTH_LOGIN)
  }

  async handler(params: LoginParams) {
    const sn = normalizeHandle(params.userSn)
    const user = await this.repos.users.findBySn(sn)
    // 사용자 열거 방지를 위해 미존재/오답/비활성 모두 동일한 일반 오류
    const ok = user ? await verifyPassword(params.password, user.user_password_hash) : false
    if (!user || !ok || user.user_status !== 'active') {
      throw new DatabaseError(ErrorCode.AUTH_ERROR, '아이디 또는 비밀번호가 올바르지 않습니다.', null)
    }
    const session = createSessionRecord(
      { user_id: user.user_id, user_sn: user.user_sn },
      params.rememberMe ?? false,
      Date.now()
    )
    SessionManager.getInstance().save(session)
    return { data: toSafeUser(user), error: null }
  }
}
