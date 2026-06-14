import { normalizeHandle } from '@/auth/normalize'
import { hashPassword } from '@/auth/password'
import { SessionManager } from '@/auth/SessionManager'
import { FIRST_ADMIN_LOCK_KEY, toSafeUser } from '@/auth/safeUser'
import { createSessionRecord } from '@/auth/session'
import { CoreBaseHandler } from '@/base/CoreBaseHandler'
import { DatabaseError } from '@/error/DatabaseError'
import { ErrorCode, IpcChannel, type SetupAdminParams } from '@/interface/CoreInterface'
import { CoreUtil } from '@/util/CoreUtil'

export class SetupAdminHandler extends CoreBaseHandler<IpcChannel.AUTH_SETUP_ADMIN> {
  constructor() {
    super(IpcChannel.AUTH_SETUP_ADMIN)
  }

  async handler(params: SetupAdminParams) {
    const passwordHash = await hashPassword(params.password)
    const userId = CoreUtil.getUuid()

    // 다이얼렉트별 advisory lock으로 동시 첫 관리자 시드를 직렬화 (PG pg_advisory_xact_lock / MySQL GET_LOCK).
    // 어댑터가 엔진 차이를 캡슐화한다 — 핸들러는 raw SQL을 들지 않는다.
    const user = await this.repos.db.transactionWithAdvisoryLock(FIRST_ADMIN_LOCK_KEY, async (tx) => {
      const existing = await this.repos.users.count(tx)
      if (existing > 0) {
        throw new DatabaseError(ErrorCode.OPERATION_FAILED_ERROR, '이미 관리자 계정이 존재합니다.', null)
      }
      return this.repos.users.create(
        {
          userId,
          userSn: normalizeHandle(params.userSn),
          passwordHash,
          userName: params.userName,
          userEmail: params.userEmail ? normalizeHandle(params.userEmail) : null,
          userRole: 'admin'
        },
        tx
      )
    })

    const session = createSessionRecord({ user_id: user.user_id, user_sn: user.user_sn }, false, Date.now())
    SessionManager.getInstance().save(session)
    return { data: toSafeUser(user), error: null }
  }
}
