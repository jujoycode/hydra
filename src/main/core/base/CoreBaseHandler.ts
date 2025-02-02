import { CoreBase } from './CoreBase'
import { CoreDataBase } from '../database/CoreDataBase'
import type { BaseValidator } from '@util/validator/BaseValidator'
import type { IpcChannel, IpcPayloads, PrismaClient } from '@interface/CoreInterface'

export abstract class CoreBaseHandler<C extends IpcChannel, T extends BaseValidator | null = null> extends CoreBase {
  public readonly ipcChannel: C
  private readonly database: CoreDataBase
  protected readonly validator?: T

  protected constructor(channel: C, ValidationClass?: new (db: CoreDataBase) => T) {
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

  public abstract handler(params: IpcPayloads[C]['send']): Promise<IpcPayloads[C]['receive']>
}
