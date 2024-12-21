import { CoreBaseHandler } from '@base/CoreBaseHandler'
import { SupabaseLib } from '@lib/SupabaseLib'
import type { SupaAuthClient, AuthUpdateUserParams } from '@interface/CoreInterface'

/**
 * 세션을 조회하는 기능을 처리하는 핸들러 클래스입니다
 * @extends CoreBaseHandler
 */
export class UpdateUserHandler extends CoreBaseHandler {
  /** Supabase 인증 클라이언트 인스턴스 */
  private supaAuthClient: SupaAuthClient

  /**
   * UpdateUserHandler 클래스의 생성자
   * @constructor
   */
  constructor() {
    super('authUpdateUser')
    this.supaAuthClient = new SupabaseLib().getSupabaseAuth()
  }

  /**
   * 현재 세션 정보를 조회합니다
   * @async
   * @returns {Promise<{data: Session | null, error: Error | null}>} 세션 데이터와 에러 정보를 포함한 객체
   * @throws {Error} 세션 조회 실패시 에러를 던집니다
   */
  async handler(params: AuthUpdateUserParams): Promise<boolean> {
    const { error } = await this.supaAuthClient.updateUser({
        data: params.data,
        phone: params.phone
    })

    if(error === null) {
        throw new Error('Failed to update user')
    }

    return true
  }
}
