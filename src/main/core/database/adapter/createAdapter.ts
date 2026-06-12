// dbms 설정에 따른 DatabaseAdapter 팩토리 (스펙 §4.1)

import type { DbmsType } from '@/interface/CoreInterface'
import type { DatabaseAdapter } from './DatabaseAdapter'
import { MySqlAdapter } from './MySqlAdapter'
import { PostgresAdapter } from './PostgresAdapter'

export function createAdapter(dbms: DbmsType | undefined): DatabaseAdapter {
  return dbms === 'mysql' ? new MySqlAdapter() : new PostgresAdapter()
}
