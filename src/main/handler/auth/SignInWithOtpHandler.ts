import { CoreBaseHandler } from '@base/CoreBaseHandler'
import { SupabaseLib } from '@lib/SupabaseLib'
import type { AuthOtpResponse, AuthSignInWithOtpParams, SupaAuthClient } from '@interface/CoreInterface'

/**
 * OTP(일회용 비밀번호)를 사용한 로그인 기능을 처리합니다
 * @extends CoreBaseHandler
 */
export class SignInWithOtpHandler extends CoreBaseHandler {
  private supaAuthClient: SupaAuthClient

  /**
   * SignInWithOtpHandler의 인스턴스를 생성합니다
   * Supabase 인증 클라이언트를 초기화합니다
   */
  constructor() {
    super('authSignInWithOtp')
    this.supaAuthClient = new SupabaseLib().getSupabaseAuth()
  }

  /**
   * 정규식을 사용하여 이메일 형식을 검증합니다
   * @param {string} email - 검증할 이메일 주소
   * @returns {boolean} 이메일 형식이 유효하면 true를 반환
   * @throws {Error} 이메일이 비어있거나 null인 경우 에러 발생
   */
  private validateEmailFormat(email: string): boolean {
    if(!email) {
        throw new Error('Email is required')
    }

    const emailRegex: RegExp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
    return emailRegex.test(email)
  }

  /**
   * OTP를 사용한 로그인 프로세스를 처리합니다
   * @param {AuthSignInWithOtpParams} params - OTP 로그인에 사용될 이메일을 포함
   * @throws {Error} 이메일 형식이 잘못되었거나 OTP 로그인이 실패한 경우 에러 발생
   */
  async handler(params: AuthSignInWithOtpParams): Promise<AuthOtpResponse> {
    // 1. Email Format Check
    if(this.validateEmailFormat(params.email)) {
        // 2. Sign In With OTP
        const { data, error } = await this.supaAuthClient.signInWithOtp({
            email: params.email,
            options: { shouldCreateUser: true }
        })
    
        if(error !== null) {
            throw error
        }

        return {
          data,
          error
        }
    } else {
        throw new Error('Invalid email format')
    }
  }
}
