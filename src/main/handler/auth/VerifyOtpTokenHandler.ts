import { CoreBaseHandler } from '@base/CoreBaseHandler'
import { SupabaseLib } from '@lib/SupabaseLib'
import {
  IpcChannel,
  SUPABASE_CLIENT_TYPE,
  type PrismaClient,
  type AuthVerifyOtpTokenParams,
  type SupaAuthClient
} from '@interface/CoreInterface'

/**
 * OTP(일회용 비밀번호)를 사용한 로그인 기능을 처리하는 핸들러 클래스
 * @extends CoreBaseHandler
 */
export class VerifyOtpTokenHandler extends CoreBaseHandler<IpcChannel.AUTH_VERIFY_OTP_TOKEN> {
  /** Supabase 인증 클라이언트 인스턴스 */
  private supaAuthClient: SupaAuthClient
  private hydraDb: PrismaClient

  /**
   * VerifyOtpTokenHandler 클래스의 생성자
   * Supabase 인증 클라이언트를 초기화합니다
   */
  constructor() {
    super(IpcChannel.AUTH_VERIFY_OTP_TOKEN)
    this.supaAuthClient = SupabaseLib.getClient(SUPABASE_CLIENT_TYPE.AUTH)
    this.hydraDb = this.getHydraDb()
  }

  /**
   * OTP 토큰을 검증하는 핸들러 메서드
   * @param {AuthVerifyOtpTokenParams} params - OTP 검증에 필요한 파라미터
   * @param {string} params.email - 사용자 이메일
   * @param {string} params.token - 검증할 OTP 토큰
   * @param {string} params.type - OTP 타입
   */
  async handler(params: AuthVerifyOtpTokenParams) {
    this.logDebug(`VerifyOtpTokenHandler Params: ${JSON.stringify(params)}`)

    const { data, error } = await this.supaAuthClient.verifyOtp({
      email: params.email,
      token: params.token,
      type: params.type
    })
    if (error !== null) throw new Error('OTP verification failed')

    const user = await this.hydraDb.users.findUnique({
      where: {
        user_id: data.user?.id
      }
    })

    if (!data.session || !user) throw new Error('Invalid user')

    const projects = await this.hydraDb.projects.findMany({
      include: {
        users_projects_link: true
      },
      where: {
        users_projects_link: {
          every: {
            user_id: data.user?.id
          }
        }
      }
    })

    return {
      data: {
        session: data.session,
        user: {
          id: user.user_id,
          name: user.user_name,
          email: user.user_email,
          created_at: user.user_created_at,
          updated_at: user.user_updated_at,
          avatar_key: user.user_avatar_key
        },
        projects
      },
      error
    }
  }
}
