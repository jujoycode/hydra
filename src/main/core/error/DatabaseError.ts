import { BaseError } from '@/error/BaseError'
import type { ErrorCode } from '@/interface/CoreInterface'

// DB 연결/질의 단계에서 발생한 실패를 사용자 친화 메시지와 함께 래핑
export class DatabaseError extends BaseError {
  constructor(code: ErrorCode, message: string, data: unknown = null) {
    super(code, data, message)
  }
}
