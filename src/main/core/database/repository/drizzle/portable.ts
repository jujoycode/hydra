// DBMS 이식 가능한 SQL 조각. pg 전용 ilike 를 양 엔진에서 동작하는 lower-LIKE 로 대체한다.

import type { AnyColumn, SQL } from 'drizzle-orm'
import { sql } from 'drizzle-orm'

// 사용자 입력의 LIKE 와일드카드(%, _)와 이스케이프 문자 자신(!)을 리터럴로 이스케이프.
// 이스케이프 문자를 '!'로 고정 — backslash('\')를 쓰면 ESCAPE '\' 절의 백슬래시를
// MySQL 서버 파서가 문자열 리터럴 이스케이프로 해석해(\' → escaped quote) 리터럴이
// 닫히지 않는 구문 오류가 된다. '!'는 양 엔진 모두에서 평범한 문자라 동일하게 동작한다.
export function escapeLikePattern(value: string): string {
  return value.replace(/[!%_]/g, (ch) => `!${ch}`)
}

// 대소문자 무시 부분 일치. pg/mysql 모두에서 collation 과 무관하게 동작.
// 패턴은 바인드 파라미터로 전달되어 SQL 인젝션에 안전하다.
export function caseInsensitiveLike(column: AnyColumn, value: string): SQL {
  const pattern = `%${escapeLikePattern(value)}%`
  return sql`lower(${column}) like lower(${pattern}) escape '!'`
}
