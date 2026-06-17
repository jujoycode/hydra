import { BaseError } from '@/error/BaseError'
import { ErrorCode } from '@/interface/CoreInterface'

export class NotFoundError extends BaseError {
  constructor(message: string, data: unknown = null) {
    super(ErrorCode.NOT_FOUND_ERROR, data, message)
  }
}
