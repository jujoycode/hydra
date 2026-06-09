import { describe, expect, it } from 'vitest'
import { createSessionRecord, isExpired, SESSION_TTL_MS } from './session'

const user = { user_id: 'u1', user_sn: 'admin' }
const NOW = 1_700_000_000_000

describe('session record', () => {
  it('default TTL is 1 day', () => {
    const s = createSessionRecord(user, false, NOW)
    expect(s.expiresAt - s.issuedAt).toBe(SESSION_TTL_MS.default)
    expect(SESSION_TTL_MS.default).toBe(24 * 60 * 60 * 1000)
  })

  it('remember-me TTL is 30 days', () => {
    const s = createSessionRecord(user, true, NOW)
    expect(s.expiresAt - s.issuedAt).toBe(SESSION_TTL_MS.remember)
    expect(SESSION_TTL_MS.remember).toBe(30 * 24 * 60 * 60 * 1000)
  })

  it('carries userId + userSn', () => {
    const s = createSessionRecord(user, false, NOW)
    expect(s.userId).toBe('u1')
    expect(s.userSn).toBe('admin')
  })

  it('isExpired compares against now', () => {
    const s = createSessionRecord(user, false, NOW)
    expect(isExpired(s, NOW + 1000)).toBe(false)
    expect(isExpired(s, s.expiresAt + 1)).toBe(true)
  })
})
