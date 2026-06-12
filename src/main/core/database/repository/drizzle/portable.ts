// DBMS 이식 가능한 SQL 조각. pg 전용 ilike 를 양 엔진에서 동작하는 lower-LIKE 로 대체한다.

import type { AnyColumn, SQL } from 'drizzle-orm'
import { sql } from 'drizzle-orm'

// 사용자 입력의 LIKE 와일드카드(%, _, \)를 리터럴로 이스케이프
export function escapeLikePattern(value: string): string {
  return value.replace(/[\\%_]/g, (ch) => `\\${ch}`)
}

// 대소문자 무시 부분 일치. pg/mysql 모두에서 collation 과 무관하게 동작.
// 패턴은 바인드 파라미터로 전달되어 SQL 인젝션에 안전하다.
export function caseInsensitiveLike(column: AnyColumn, value: string): SQL {
  const pattern = `%${escapeLikePattern(value)}%`
  return sql`lower(${column}) like lower(${pattern}) escape '\\'`
}
