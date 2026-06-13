// dbms 설정에 따른 DatabaseAdapter 팩토리 (스펙 §4.1)

import { DatabaseError } from '@/error/DatabaseError'
import type { DbmsType } from '@/interface/CoreInterface'
import { ErrorCode } from '@/interface/CoreInterface'
import type { MigrationDialect } from '../migrate/migrationsPath'
import type { DatabaseAdapter } from './DatabaseAdapter'
import { MySqlAdapter } from './MySqlAdapter'
import { PostgresAdapter } from './PostgresAdapter'

export function createAdapter(dbms: DbmsType | undefined): DatabaseAdapter {
  // undefined는 구버전 renderer persist 호환 (postgresql), 그 외 알 수 없는 값은 fail-fast
  if (dbms === undefined || dbms === 'postgresql') {
    return new PostgresAdapter()
  }
  if (dbms === 'mysql') {
    return new MySqlAdapter()
  }
  throw new DatabaseError(ErrorCode.VALIDATION_ERROR, `Unsupported dbms: "${String(dbms)}"`, null)
}

// DbmsType('postgresql'|'mysql') → 마이그레이션 폴더 dialect('pg'|'mysql') 매핑 (한 곳에서 관리)
export function toMigrationDialect(dbms: DbmsType | undefined): MigrationDialect {
  return dbms === 'mysql' ? 'mysql' : 'pg'
}
