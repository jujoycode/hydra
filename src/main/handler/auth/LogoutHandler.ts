import { SessionManager } from '@/auth/SessionManager'
import { CoreBaseHandler } from '@/base/CoreBaseHandler'
import { IpcChannel } from '@/interface/CoreInterface'

export class LogoutHandler extends CoreBaseHandler<IpcChannel.AUTH_LOGOUT> {
  constructor() {
    super(IpcChannel.AUTH_LOGOUT)
  }

  async handler() {
    SessionManager.getInstance().clear()
    return { data: true, error: null }
  }
}
