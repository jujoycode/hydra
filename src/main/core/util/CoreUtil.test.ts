import { describe, expect, it } from 'vitest'
import { CoreUtil } from './CoreUtil'

describe('CoreUtil', () => {
  describe('getUuid', () => {
    it('should return a valid UUID v7 string', () => {
      const uuid = CoreUtil.getUuid()
      expect(uuid).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-7[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i)
    })

    it('should return unique values on each call', () => {
      const uuid1 = CoreUtil.getUuid()
      const uuid2 = CoreUtil.getUuid()
      expect(uuid1).not.toBe(uuid2)
    })
  })

  describe('getEnv', () => {
    it('should return environment variable value', () => {
      process.env.TEST_VAR = 'test_value'
      expect(CoreUtil.getEnv('TEST_VAR')).toBe('test_value')
      delete process.env.TEST_VAR
    })

    it('should throw when key is empty', () => {
      expect(() => CoreUtil.getEnv('')).toThrow('Environment variable key is required')
    })

    it('should throw when variable is not set', () => {
      expect(() => CoreUtil.getEnv('NON_EXISTENT_VAR_12345')).toThrow(
        'Environment variable NON_EXISTENT_VAR_12345 is not set'
      )
    })
  })
})

describe('CoreUtil.getUuid', () => {
  it('generates a v7 UUID (time-ordered)', () => {
    const id = CoreUtil.getUuid()
    // RFC 9562: version nibble is the first char of the 3rd group
    expect(id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-7[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/)
  })

  it('generates time-ordered ids (later id sorts after earlier id)', async () => {
    const a = CoreUtil.getUuid()
    await new Promise((r) => setTimeout(r, 2))
    const b = CoreUtil.getUuid()
    expect(a < b).toBe(true)
  })
})
