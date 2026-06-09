import { describe, expect, it } from 'vitest'
import { escapeLikePattern } from './portable'

describe('escapeLikePattern', () => {
  it('escapes LIKE wildcards so user input is treated literally', () => {
    expect(escapeLikePattern('50% done')).toBe('50\\% done')
    expect(escapeLikePattern('a_b')).toBe('a\\_b')
    expect(escapeLikePattern('back\\slash')).toBe('back\\\\slash')
  })

  it('leaves ordinary text untouched', () => {
    expect(escapeLikePattern('hello world')).toBe('hello world')
  })
})
