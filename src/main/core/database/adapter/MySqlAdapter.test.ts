import { describe, expect, it } from 'vitest'
import { ErrorCode } from '../../interface/CoreInterface'
import { wrapMySqlError } from './MySqlAdapter'

const ctx = { host: 'h', port: 3306, database: 'd', user: 'u' }

describe('wrapMySqlError', () => {
  it('maps ER_ACCESS_DENIED_ERROR(1045) to AUTH_ERROR', () => {
    const e = wrapMySqlError({ errno: 1045, message: 'Access denied' }, ctx)
    expect(e.code).toBe(ErrorCode.AUTH_ERROR)
  })

  it('maps ER_BAD_DB_ERROR(1049) to NOT_FOUND_ERROR', () => {
    const e = wrapMySqlError({ errno: 1049, message: 'Unknown database' }, ctx)
    expect(e.code).toBe(ErrorCode.NOT_FOUND_ERROR)
  })

  it('maps DB/table access denied (1044, 1142, 1227) to PERMISSION_ERROR', () => {
    for (const errno of [1044, 1142, 1227]) {
      expect(wrapMySqlError({ errno, message: 'denied' }, ctx).code).toBe(ErrorCode.PERMISSION_ERROR)
    }
  })

  it('maps network errno codes to NETWORK_ERROR', () => {
    for (const code of ['ECONNREFUSED', 'ENOTFOUND', 'EAI_AGAIN', 'ETIMEDOUT', 'ECONNRESET']) {
      expect(wrapMySqlError({ code, message: 'net' }, ctx).code).toBe(ErrorCode.NETWORK_ERROR)
    }
  })

  it('falls back to DB_ERROR preserving the message', () => {
    const e = wrapMySqlError({ errno: 9999, message: 'boom' }, ctx)
    expect(e.code).toBe(ErrorCode.DB_ERROR)
    expect(e.message).toBe('boom')
  })

  it('unwraps DrizzleQueryError cause chains to map the original errno', () => {
    // drizzle-orm 0.45+ wraps query errors: outer message는 'Failed query: <DDL>' 형태,
    // 원본 mysql2 에러는 cause에 있다 — errno 1142는 PERMISSION_ERROR로 매핑돼야 한다
    const drizzleStyle = {
      message: 'Failed query: CREATE TABLE ...',
      cause: { errno: 1142, message: 'CREATE command denied to user' }
    }
    const e = wrapMySqlError(drizzleStyle, ctx)
    expect(e.code).toBe(ErrorCode.PERMISSION_ERROR)
  })
})
