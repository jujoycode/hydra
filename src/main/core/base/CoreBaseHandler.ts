import { CoreBase } from './CoreBase'
import { CoreDataBase } from '../database/CoreDataBase'
import type { PrismaClient } from '@interface/CoreInterface'

export abstract class CoreBaseHandler extends CoreBase {
  public readonly ipcChannel: string

  protected constructor(channel: string) {
    super()
    this.ipcChannel = channel

    this.handler = this.handler.bind(this)
  }

  protected getHydraDb(): PrismaClient {
    return CoreDataBase.getInstance().getPrismaClient()
  }

  public abstract handler(params: unknown): Promise<unknown>
}
