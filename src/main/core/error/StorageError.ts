import { BaseError } from '@/error/BaseError'
import { ErrorCode } from '@/interface/CoreInterface'

export class StorageError extends BaseError {
  constructor(message: string) {
    super(ErrorCode.STORAGE_ERROR, null, message)
  }
}
