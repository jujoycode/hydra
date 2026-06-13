import type { IpcChannel, IpcPayloads } from '@/interface/CoreInterface'
import type { BaseValidator } from '@/util/validator/BaseValidator'
import { RepositoryContainer } from '../database/RepositoryContainer'
import { CoreBase } from './CoreBase'

export abstract class CoreBaseHandler<C extends IpcChannel, T extends BaseValidator | null = null> extends CoreBase {
  public readonly ipcChannel: C
  private _validator?: T
  private readonly ValidatorClass?: new (
    repos: RepositoryContainer
  ) => T

  protected constructor(channel: C, ValidationClass?: new (repos: RepositoryContainer) => T) {
    super()
    this.ipcChannel = channel
    this.ValidatorClass = ValidationClass
    this.handler = this.handler.bind(this)
  }

  // Lazy-initialize validator (only after RepositoryContainer is initialized)
  protected get validator(): T | undefined {
    if (this.ValidatorClass && !this._validator) {
      this._validator = new this.ValidatorClass(RepositoryContainer.getInstance())
    }
    return this._validator
  }

  protected get repos(): RepositoryContainer {
    return RepositoryContainer.getInstance()
  }

  public abstract handler(params: IpcPayloads[C]['send']): Promise<IpcPayloads[C]['receive']>
}
