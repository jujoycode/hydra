import { describe, expect, it } from 'vitest'
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
})

describe('toMigrationDialect', () => {
  it('maps dbms to migration dialect', () => {
    expect(toMigrationDialect('postgresql')).toBe('pg')
    expect(toMigrationDialect('mysql')).toBe('mysql')
    expect(toMigrationDialect(undefined)).toBe('pg')
  })
})
