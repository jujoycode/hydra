import { describe, expect, it } from 'vitest'
import { hashPassword, verifyPassword } from './password'

describe('password hashing', () => {
  it('produces a self-describing scrypt string', async () => {
    const encoded = await hashPassword('correct horse battery staple')
    expect(encoded).toMatch(/^scrypt\$N=32768,r=8,p=1\$[A-Za-z0-9+/=]+\$[A-Za-z0-9+/=]+$/)
  })

  it('verifies the correct password', async () => {
    const encoded = await hashPassword('hunter2')
    expect(await verifyPassword('hunter2', encoded)).toBe(true)
  })

  it('rejects a wrong password', async () => {
    const encoded = await hashPassword('hunter2')
    expect(await verifyPassword('hunter3', encoded)).toBe(false)
  })

  it('uses a random salt (two hashes of same input differ)', async () => {
    const a = await hashPassword('same')
    const b = await hashPassword('same')
    expect(a).not.toBe(b)
    expect(await verifyPassword('same', a)).toBe(true)
    expect(await verifyPassword('same', b)).toBe(true)
  })

  it('returns false on a malformed stored hash instead of throwing', async () => {
    expect(await verifyPassword('x', 'not-a-valid-hash')).toBe(false)
  })
})
