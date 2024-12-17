import { CoreUtil } from '@util/CoreUtil'
import { createClient, SupabaseClient } from '@supabase/supabase-js'

export class SupabaseUtil extends CoreUtil {
  private supa: SupabaseClient

  constructor() {
    super()
    this.supa = this.createSupabaseClient()

    this.logInfo('Supabase client created')
  }

  private createSupabaseClient() {
    try {
      return createClient(this.getEnv('VITE_SUPABASE_PROJECT_URL'), this.getEnv('VITE_SUPABASE_ANON_KEY'))
    } catch (error) {
      this.logError('Failed to create Supabase client')
      throw error
    }
  }

  public getSupabaseClient() {
    return this.supa
  }

  public getSupabaseAuth() {
    return this.supa.auth
  }
}
