import { CoreBaseHandler } from '@base/CoreBaseHandler'
import { SupabaseLib } from '@lib/SupabaseLib'
import type { AuthSignOutParams, SupaAuthClient } from '@interface/CoreInterface'

/**
 * 로그아웃 기능을 처리하는 핸들러 클래스입니다.
 * @extends CoreBaseHandler
 */
export class SignOutHandler extends CoreBaseHandler {
  /** Supabase 인증 클라이언트 인스턴스 */
  private supaAuthClient: SupaAuthClient

  /**
   * SignOutHandler 클래스의 생성자
   * @constructor
   */
  constructor() {
    super('authSignOut')
    this.supaAuthClient = new SupabaseLib().getSupabaseAuth()
  }

  /**
   * 로그아웃 요청을 처리하는 핸들러 메서드
   * @param {AuthSignOutParams} params - 로그아웃 범위를 지정하는 파라미터
   * @param {('global'|'local'|'others'|undefined)} params.scope - 로그아웃 범위
   * @throws {Error} 로그아웃 실패 시 에러를 발생시킵니다
   * @returns {Promise<void>}
   */
  async handler(params: AuthSignOutParams): Promise<void> {
    const { error } = await this.supaAuthClient.signOut({ scope: params.scope })

    if(error === null) {
      throw new Error('Failed to sign out')
    }
  }
}
