import { CoreBaseHandler } from '@/base/CoreBaseHandler'
import { SupabaseLib } from '@/lib/SupabaseLib'
import {
  SUPABASE_CLIENT_TYPE,
  IpcChannel,
  type AuthUpdateUserParams,
  type SupaStorageClient,
} from '@/interface/CoreInterface'
import { CoreConstant } from '@/constant/CoreConstant'
/**
 * 세션을 조회하는 기능을 처리하는 핸들러 클래스입니다
 * @extends CoreBaseHandler
 */
export class UpdateUserHandler extends CoreBaseHandler<IpcChannel.AUTH_UPDATE_USER> {
  /** Supabase 스토리지 클라이언트 인스턴스 */
  private supaStorageClient: SupaStorageClient

  /**
   * UpdateUserHandler 클래스의 생성자
   * @constructor
   */
  constructor() {
    super(IpcChannel.AUTH_UPDATE_USER)
    this.supaStorageClient = SupabaseLib.getClient(SUPABASE_CLIENT_TYPE.STORAGE)
  }

  /**
   * 사용자 정보를 업데이트합니다
   */
  async handler(params: AuthUpdateUserParams) {
    console.debug(`UpdateUserHandler Params: ${JSON.stringify(params)}`)

    let existAvatarFile: boolean = false

    // 1. 사용자 아바타 파일 존재 여부 확인 (Supabase Storage)
    if (params.userAvatarKey) {
      const { data, error } = await this.supaStorageClient.from(CoreConstant.BUCKET_NAME).exists(params.userAvatarKey)
      if (error) throw new Error('Users Avatar File is not exist.')
      existAvatarFile = data
    }

    // 2. 사용자 정보 업데이트 (public.users)
    const user = await this.getHydraDb()
      .users.update({
        where: {
          user_id: params.userId
        },
        data: {
          user_name: params.userName,
          user_avatar_key: existAvatarFile ? params.userAvatarKey : null
        }
      })
      .catch((error: any) => {
        this.logError(`Failed to update user: ${error.message}`)
        throw error
      })

    return { data: user, error: null }
  }
}
