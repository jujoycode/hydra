import { sql } from 'drizzle-orm'
import { normalizeHandle } from '@/auth/normalize'
import { hashPassword } from '@/auth/password'
import { SessionManager } from '@/auth/SessionManager'
import { FIRST_ADMIN_LOCK_KEY, toSafeUser } from '@/auth/safeUser'
import { createSessionRecord } from '@/auth/session'
import { CoreBaseHandler } from '@/base/CoreBaseHandler'
import type { DrizzleTx } from '@/database/repository/drizzle/executor'
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

    const user = await this.repos.db.transaction(async (tx) => {
      // 트랜잭션 스코프 advisory lock — 커밋/롤백 시 자동 해제, 동시 시드 직렬화
      await (tx as DrizzleTx).execute(sql`SELECT pg_advisory_xact_lock(${FIRST_ADMIN_LOCK_KEY})`)
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
