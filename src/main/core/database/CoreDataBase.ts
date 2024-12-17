import { CoreBase } from '@base/CoreBase'
import { SupabaseUtil } from '@util/SupabaseUtil'
import type { SupaClient } from '@interface/CoreInterface'

export class CoreDataBase extends CoreBase {
  private supaClient: SupaClient

  constructor() {
    super()
    this.supaClient = new SupabaseUtil().getSupabaseClient()
  }

  public async getData(table: string, column: string, id: string) {
    const { data, error } = await this.supaClient.from(table).select(column).eq('id', id)
    if (error) this.logError(error.message)
    return data
  }
}
