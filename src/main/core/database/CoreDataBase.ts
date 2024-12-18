import { CoreBase } from '@base/CoreBase'
import { PrismaDataBase } from './PrismaDataBase'
import { CoreInterface, SupaClient, PrisClient, SupaAuthClient } from '@interface/CoreInterface'
import { SupaDataBase } from './SupaDataBase'

export class CoreDataBase extends CoreBase implements CoreInterface {
  private supaClient: SupaClient
  private prismaClient: PrisClient
  
  constructor() {
    super()
    this.supaClient = new SupaDataBase().getSupabaseClient()
    this.prismaClient = new PrismaDataBase().getPrismaClient()
  }

  public getPrismaClient(): PrisClient {
    return this.prismaClient
  }

  public getSupabaseClient(): SupaClient {
    return this.supaClient
  }

  public getSupabaseAuthClient(): SupaAuthClient {
    return this.supaClient.auth
  }
}
