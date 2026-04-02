import { BaseError } from '@/error/BaseError'
import { ErrorCode } from '@/interface/CoreInterface'

export class OperationFailedError extends BaseError {
  constructor(message: string) {
    super(ErrorCode.OPERATION_FAILED_ERROR, null, message)
  }
}
