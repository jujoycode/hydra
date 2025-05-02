import { CoreBase } from '@/base/CoreBase'
import { CoreUtil } from '@/util/CoreUtil'
import { createClient } from '@supabase/supabase-js'
import {
  SUPABASE_CLIENT_TYPE,
  type SupaClient,
  type SupaAuthClient,
  type SupaStorageClient
} from '@/interface/CoreInterface'

export class SupabaseLib extends CoreBase {
  private static instance: SupabaseLib
  private supa: SupaClient

  protected constructor() {
    super()
    this.supa = this.createSupabaseClient()

    this.logInfo('Supabase client created')
  }

  /**
   * getClient
   * @pattern Singleton
   * @desc Supabase Instance 생성 후 요청한 클라이언트를 반환합니다
   */
  static getClient(type: SUPABASE_CLIENT_TYPE.CLIENT): SupaClient
  static getClient(type: SUPABASE_CLIENT_TYPE.AUTH): SupaAuthClient
  static getClient(type: SUPABASE_CLIENT_TYPE.STORAGE): SupaStorageClient
  static getClient(type: SUPABASE_CLIENT_TYPE): SupaClient | SupaAuthClient | SupaStorageClient {
    if (!SupabaseLib.instance) {
      SupabaseLib.instance = new SupabaseLib()
    }

    switch (type) {
      case SUPABASE_CLIENT_TYPE.CLIENT: {
        return SupabaseLib.instance.supa
      }
      case SUPABASE_CLIENT_TYPE.AUTH: {
        return SupabaseLib.instance.supa.auth
      }
      case SUPABASE_CLIENT_TYPE.STORAGE: {
        return SupabaseLib.instance.supa.storage
      }
    }
  }

  /**
   * createSupabaseClient
   * @desc
   */
  private createSupabaseClient() {
    try {
      return createClient(CoreUtil.getEnv('VITE_SUPABASE_PROJECT_URL'), CoreUtil.getEnv('VITE_SUPABASE_ANON_KEY'))
    } catch (error) {
      this.logError('Failed to create Supabase client')
      throw error
    }
  }
}
