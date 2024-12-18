import { CoreDataBase } from '../database/CoreDataBase'
import type { PrisClient } from '@interface/CoreInterface'

export abstract class CoreBaseHandler {
  private CoreDataBase: CoreDataBase
  public ipcChannel: string

  protected constructor(channel: string) {
    this.CoreDataBase = CoreDataBase.getInstance()
    this.ipcChannel = channel
  }

  public getDatabase(): PrisClient {
    return this.CoreDataBase.getPrismaClient()
  }

  abstract handler(): void
}
