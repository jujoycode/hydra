import { CoreBase } from '@base/CoreBase'
import { CoreUtil } from '@util/CoreUtil'
import { createClient, SupabaseClient } from '@supabase/supabase-js'
import type { SupaAuthClient, SupaStorageClient } from '@interface/CoreInterface'

export class SupabaseLib extends CoreBase {
  private static instance: SupabaseLib
  private supa: SupabaseClient

  protected constructor() {
    super()
    this.supa = this.createSupabaseClient()

    this.logInfo('Supabase client created')
  }

  /**
   * getInstance
   * @pattern Singleton
   * @desc Supabase Instance 생성 후 요청한 클라이언트를 반환합니다
   */
  static getClient(type: 'client'): SupabaseClient
  static getClient(type: 'auth'): SupaAuthClient
  static getClient(type: 'storage'): SupaStorageClient
  static getClient(type: 'client' | 'auth' | 'storage'): SupabaseClient | SupaAuthClient | SupaStorageClient {
    if (!SupabaseLib.instance) {
      SupabaseLib.instance = new SupabaseLib()
    }

    switch (type) {
      case 'client': {
        return SupabaseLib.instance.supa
      }
      case 'auth': {
        return SupabaseLib.instance.getSupabaseAuth()
      }
      case 'storage': {
        return SupabaseLib.instance.getSupabaseStorage()
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

  /**
   * getSupabaseAuth
   * @desc
   */
  public getSupabaseAuth(): SupaAuthClient {
    return this.supa.auth
  }

  /**
   * getSupabaseStorage
   * @desc
   */
  public getSupabaseStorage(): SupaStorageClient {
    return this.supa.storage
  }
}
