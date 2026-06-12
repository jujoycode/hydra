import { describe, expect, it } from 'vitest'
import { normalizeHandle } from './normalize'

describe('normalizeHandle', () => {
  it('trims and lowercases', () => {
    expect(normalizeHandle('  JuJoyCode ')).toBe('jujoycode')
    expect(normalizeHandle('A@B.COM')).toBe('a@b.com')
  })
})
