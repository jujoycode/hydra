import { CoreBase } from './CoreBase'
import { CoreDataBase } from '../database/CoreDataBase'
import { BaseValidator } from '@util/validator/BaseValidator'
import type { PrismaClient } from '@interface/CoreInterface'

export abstract class CoreBaseHandler<T extends BaseValidator | null = null> extends CoreBase {
  public readonly ipcChannel: string
  protected readonly database: CoreDataBase
  protected readonly validator?: T

  protected constructor(channel: string, ValidationClass?: new (db: CoreDataBase) => T) {
    super()
    this.ipcChannel = channel
    this.database = CoreDataBase.getInstance()

    if (ValidationClass) {
      this.validator = new ValidationClass(this.database)
    }

    this.handler = this.handler.bind(this)
  }

  protected getHydraDb(): PrismaClient {
    return this.database.getPrismaClient()
  }

  public abstract handler(params: unknown): Promise<unknown>
}
