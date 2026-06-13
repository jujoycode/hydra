import type { BaseErrorType, ErrorCode } from '@/interface/CoreInterface'

export class BaseError extends Error implements BaseErrorType {
  constructor(
    public readonly code: ErrorCode,
    public readonly data: unknown,
    message: string
  ) {
    super(message)
    this.name = this.constructor.name
    Error.captureStackTrace(this, this.constructor)
  }

  toJSON() {
    return {
      error: true,
      code: this.code,
      message: this.message,
      data: this.data
    }
  }
}
