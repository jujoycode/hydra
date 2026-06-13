import { describe, expect, it } from 'vitest'
import { DatabaseError } from '../../error/DatabaseError'
import { ErrorCode } from '../../interface/CoreInterface'
import { createAdapter, toMigrationDialect } from './createAdapter'
import { MySqlAdapter } from './MySqlAdapter'
import { PostgresAdapter } from './PostgresAdapter'

describe('createAdapter', () => {
  it('returns PostgresAdapter for postgresql', () => {
    expect(createAdapter('postgresql')).toBeInstanceOf(PostgresAdapter)
  })
  it('returns MySqlAdapter for mysql', () => {
    expect(createAdapter('mysql')).toBeInstanceOf(MySqlAdapter)
  })
  it('defaults to PostgresAdapter when dbms is omitted', () => {
    expect(createAdapter(undefined)).toBeInstanceOf(PostgresAdapter)
  })
  it('throws VALIDATION_ERROR for an unknown dbms value', () => {
    let caught: unknown
    try {
      createAdapter('sqlite' as never)
    } catch (e) {
      caught = e
    }
    expect(caught).toBeInstanceOf(DatabaseError)
    expect((caught as DatabaseError).code).toBe(ErrorCode.VALIDATION_ERROR)
  })
})

describe('toMigrationDialect', () => {
  it('maps dbms to migration dialect', () => {
    expect(toMigrationDialect('postgresql')).toBe('pg')
    expect(toMigrationDialect('mysql')).toBe('mysql')
    expect(toMigrationDialect(undefined)).toBe('pg')
  })
})
