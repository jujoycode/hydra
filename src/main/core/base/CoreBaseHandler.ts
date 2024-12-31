import { CoreBase } from './CoreBase'
import { CoreDataBase } from '../database/CoreDataBase'
import type { PrismaClient } from '@interface/CoreInterface'

export abstract class CoreBaseHandler extends CoreBase {
  protected readonly hydraDB: PrismaClient
  public readonly ipcChannel: string

  protected constructor(channel: string) {
    super()
    this.ipcChannel = channel
    this.hydraDB = CoreDataBase.getInstance().getPrismaClient()

    this.handler = this.handler.bind(this)
  }

  public abstract handler(params: unknown): Promise<unknown>
}
