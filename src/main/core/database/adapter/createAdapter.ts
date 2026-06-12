// dbms 설정에 따른 DatabaseAdapter 팩토리 (스펙 §4.1)

import type { DbmsType } from '@/interface/CoreInterface'
import type { MigrationDialect } from '../migrate/migrationsPath'
import type { DatabaseAdapter } from './DatabaseAdapter'
import { MySqlAdapter } from './MySqlAdapter'
import { PostgresAdapter } from './PostgresAdapter'

export function createAdapter(dbms: DbmsType | undefined): DatabaseAdapter {
  return dbms === 'mysql' ? new MySqlAdapter() : new PostgresAdapter()
}

// DbmsType('postgresql'|'mysql') → 마이그레이션 폴더 dialect('pg'|'mysql') 매핑 (한 곳에서 관리)
export function toMigrationDialect(dbms: DbmsType | undefined): MigrationDialect {
  return dbms === 'mysql' ? 'mysql' : 'pg'
}
