import { BaseError } from '@/error/BaseError'
import { ErrorCode } from '@/interface/CoreInterface'

export class ValidationError extends BaseError {
  constructor(message: string, data: unknown) {
    super(ErrorCode.VALIDATION_ERROR, data, message)
  }
}
