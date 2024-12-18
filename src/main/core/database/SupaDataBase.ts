import { SupabaseUtil } from '@util/SupabaseUtil'
import type { SupaClient } from '@interface/CoreInterface'

export class SupaDataBase {
  private supaClient: SupaClient

  constructor() {
    this.supaClient = new SupabaseUtil().getSupabaseClient()
  }

  public getSupabaseClient() {
    return this.supaClient
  }

  public getSupabaseAuthClient() {
    return this.supaClient.auth
  }
}
