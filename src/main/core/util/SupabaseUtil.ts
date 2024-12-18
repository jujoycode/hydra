import { CoreUtil } from '@util/CoreUtil'
import { createClient, SupabaseClient } from '@supabase/supabase-js'
import type { SupaAuthClient, SupaStorageClient } from '@interface/CoreInterface'
export class SupabaseUtil extends CoreUtil {
  private supa: SupabaseClient

  constructor() {
    super()
    this.supa = this.createSupabaseClient()

    this.logInfo('Supabase client created')
  }

  /**
   * createSupabaseClient
   * @desc
   */
  private createSupabaseClient() {
    try {
      return createClient(this.getEnv('VITE_SUPABASE_PROJECT_URL'), this.getEnv('VITE_SUPABASE_ANON_KEY'))
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

  /**
   * getSupabaseClient
   * @deprecated
   */
  public getSupabaseClient(): SupabaseClient {
    return this.supa
  }
}
