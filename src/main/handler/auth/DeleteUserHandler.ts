import { CoreBaseHandler } from '@base/CoreBaseHandler'
import { SupabaseLib } from '@/lib/SupabaseLib'
import {
  IpcChannel,
  SUPABASE_CLIENT_TYPE,
  type AuthDeleteUserParams,
  type SupaAuthClient
} from '@interface/CoreInterface'

/**
 * 사용자 삭제 기능을 처리하는 핸들러 클래스입니다.
 * @extends CoreBaseHandler
 */
export class DeleteUserHandler extends CoreBaseHandler<IpcChannel.AUTH_DELETE_USER> {
  /** Supabase 인증 클라이언트 인스턴스 */
  private supaAuthClient: SupaAuthClient

  /**
   * DeleteUserHandler 클래스의 생성자
   * @constructor
   */
  constructor() {
    super(IpcChannel.AUTH_DELETE_USER)
    this.supaAuthClient = SupabaseLib.getClient(SUPABASE_CLIENT_TYPE.AUTH)
  }

  /**
   * 사용자를 삭제하는 핸들러 메서드
   * @param {AuthDeleteUserParams} params - 사용자 삭제에 필요한 파라미터
   * @param {string} params.id - 삭제할 사용자의 ID
   * @param {boolean} params.shouldSoftDelete - 소프트 삭제 여부
   * @throws {Error} 사용자 삭제 실패 시 에러를 던집니다
   */
  async handler(params: AuthDeleteUserParams) {
    const { data: _, error } = await this.supaAuthClient.admin.deleteUser(params.id, params.shouldSoftDelete)

    if (error !== null) {
      throw new Error('Failed to delete user')
    }

    return { data: null, error }
  }
}
