import { CoreBaseHandler } from '@base/CoreBaseHandler'
import { SupabaseLib } from '@lib/SupabaseLib'
import { SUPABASE_CLIENT_TYPE, type AuthUpdateUserParams, users, type SupaStorageClient, type SupaAuthClient } from '@interface/CoreInterface'
import { CoreConstant } from '@constant/CoreConstant'
/**
 * 세션을 조회하는 기능을 처리하는 핸들러 클래스입니다
 * @extends CoreBaseHandler
 */
export class UpdateUserHandler extends CoreBaseHandler {
  /** Supabase 스토리지 클라이언트 인스턴스 */
  private supaAuthClient: SupaAuthClient
  private supaStorageClient: SupaStorageClient

  

  /**
   * UpdateUserHandler 클래스의 생성자
   * @constructor
   */
  constructor() {
    super('authUpdateUser')
    this.supaAuthClient = SupabaseLib.getClient(SUPABASE_CLIENT_TYPE.AUTH)
    this.supaStorageClient = SupabaseLib.getClient(SUPABASE_CLIENT_TYPE.STORAGE)
  }

  /**
   * 사용자 정보를 업데이트합니다
   * @async
   * @returns {Promise<{data: Session | null, error: Error | null}>} 세션 데이터와 에러 정보를 포함한 객체
   * @throws {Error} 세션 조회 실패시 에러를 던집니다
   */
  async handler(params: AuthUpdateUserParams): Promise<users> {
    console.debug(`UpdateUserHandler Params: ${JSON.stringify(params)}`)

    let existAvatarFile: boolean = false
    // 1. 사용자 아바타 파일 존재 여부 확인 (Supabase Storage)
    if(params.userAvatarKey) {
      const { data, error } = await this.supaStorageClient.from(CoreConstant.BUCKET_NAME).exists(params.userAvatarKey)
      if(error) throw new Error('Users Avatar File is not exist.')
      existAvatarFile = data
    }

    // 2. 사용자 정보 업데이트 (public.users)
    const user = await this.getHydraDb().users.update({
      where: {
        user_id: params.userId
      },
      data: {
        user_name: params.userName,
        user_avatar_key: existAvatarFile ? params.userAvatarKey : null
      }
    }).catch(err => {
      const error = err as Error
      throw new Error(`Failed to update user: ${error.message}`)
    })


    return user
  }
}
