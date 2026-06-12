// 듀얼 스키마(PG/MySQL)가 같은 테이블·컬럼 집합을 정의하는지 검증 (스펙 §4.2)
// 타입은 엔진별로 다르지만(uuid vs char(36)) 이름 집합은 절대 어긋나면 안 된다.

import { getTableName, is } from 'drizzle-orm'
import { type AnyMySqlTable, MySqlTable, getTableConfig as mysqlTableConfig } from 'drizzle-orm/mysql-core'
import { type AnyPgTable, PgTable, getTableConfig as pgTableConfig } from 'drizzle-orm/pg-core'
import { describe, expect, it } from 'vitest'
import * as pgSchema from './schema'
import * as mysqlSchema from './schema.mysql'

function pgTables(): AnyPgTable[] {
  return Object.values(pgSchema).filter((v) => is(v, PgTable)) as AnyPgTable[]
}
function mysqlTables(): AnyMySqlTable[] {
  return Object.values(mysqlSchema).filter((v) => is(v, MySqlTable)) as AnyMySqlTable[]
}

describe('schema parity (pg vs mysql)', () => {
  it('exports the same module keys (repositories destructure by export name)', () => {
    expect(Object.keys(mysqlSchema).sort()).toEqual(Object.keys(pgSchema).sort())
  })

  it('defines the same set of tables', () => {
    const pgNames = pgTables().map(getTableName).sort()
    const myNames = mysqlTables().map(getTableName).sort()
    expect(myNames).toEqual(pgNames)
  })

  it('defines the same column names per table', () => {
    const myByName = new Map(mysqlTables().map((t) => [getTableName(t), t]))
    for (const pgTable of pgTables()) {
      const name = getTableName(pgTable)
      const myTable = myByName.get(name)
      expect(myTable, `mysql schema missing table ${name}`).toBeDefined()
      const pgCols = pgTableConfig(pgTable)
        .columns.map((c) => c.name)
        .sort()
      const myCols = mysqlTableConfig(myTable as MySqlTable)
        .columns.map((c) => c.name)
        .sort()
      expect(myCols, `column mismatch in ${name}`).toEqual(pgCols)
    }
  })
})
