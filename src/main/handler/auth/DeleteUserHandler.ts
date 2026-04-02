import { CoreBaseHandler } from '@/base/CoreBaseHandler'
import { type AuthDeleteUserParams, IpcChannel } from '@/interface/CoreInterface'

/**
 * 사용자 삭제 기능을 처리하는 핸들러 클래스입니다.
 * @extends CoreBaseHandler
 */
export class DeleteUserHandler extends CoreBaseHandler<IpcChannel.AUTH_DELETE_USER> {
  constructor() {
    super(IpcChannel.AUTH_DELETE_USER)
  }

  /**
   * 사용자를 삭제하는 핸들러 메서드
   * @param {AuthDeleteUserParams} params - 사용자 삭제에 필요한 파라미터
   * @param {string} params.id - 삭제할 사용자의 ID
   * @param {boolean} params.shouldSoftDelete - 소프트 삭제 여부
   */
  async handler(params: AuthDeleteUserParams) {
    // 1. DB 역할 삭제
    const user = await this.repos.users.findById(params.id)
    if (user?.user_db_role) {
      await this.repos.db.dropRole(user.user_db_role)
    }

    // 2. 사용자 삭제
    await this.repos.users.delete(params.id)

    return { data: null, error: null }
  }
}
