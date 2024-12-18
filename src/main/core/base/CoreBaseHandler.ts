import { CoreDataBase } from '../database/CoreDataBase'
import type { PrismaClient } from '@interface/CoreInterface'

export abstract class CoreBaseHandler {
  private CoreDataBase: CoreDataBase
  public ipcChannel: string

  protected constructor(channel: string) {
    this.CoreDataBase = CoreDataBase.getInstance()
    this.ipcChannel = channel
  }

  public getDatabase(): PrismaClient {
    return this.CoreDataBase.getPrismaClient()
  }

  abstract handler(): void
}
