import { BaseError } from '@/error/BaseError'
import { ErrorCode } from '@/interface/CoreInterface'

export class NetworkError extends BaseError {
  constructor(message: string, data: unknown = null) {
    super(ErrorCode.NETWORK_ERROR, data, message)
  }
}
