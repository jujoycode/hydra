import { CoreBase } from './CoreBase'
import { CoreDataBase } from '../database/CoreDataBase'
import type { PrismaClient } from '@interface/CoreInterface'

export abstract class CoreBaseHandler extends CoreBase {
  protected hydraDB: PrismaClient
  public ipcChannel: string

  protected constructor(channel: string) {
    super()
    this.hydraDB = CoreDataBase.getInstance().getPrismaClient()
    this.ipcChannel = channel

    this.handler = this.handler.bind(this)
  }

  abstract handler(params: unknown): Promise<unknown>
}
