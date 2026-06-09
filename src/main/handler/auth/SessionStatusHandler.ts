import { SessionManager } from '@/auth/SessionManager'
import { toSafeUser } from '@/auth/safeUser'
import { isExpired } from '@/auth/session'
import { CoreBaseHandler } from '@/base/CoreBaseHandler'
import { IpcChannel } from '@/interface/CoreInterface'

export class SessionStatusHandler extends CoreBaseHandler<IpcChannel.AUTH_SESSION_STATUS> {
  constructor() {
    super(IpcChannel.AUTH_SESSION_STATUS)
  }

  async handler() {
    const mgr = SessionManager.getInstance()
    const session = mgr.load()
    if (!session || isExpired(session, Date.now())) {
      mgr.clear()
      return { data: { authenticated: false, user: null }, error: null }
    }
    // 사용자 존재 + 활성 재검증
    const user = await this.repos.users.findById(session.userId)
    if (!user || user.user_status !== 'active') {
      mgr.clear()
      return { data: { authenticated: false, user: null }, error: null }
    }
    return { data: { authenticated: true, user: toSafeUser(user) }, error: null }
  }
}
