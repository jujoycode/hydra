// RETURNING 미지원 DBMS(MySQL) 대응: 쓰기 후 PK로 행을 다시 조회한다.
// id는 앱에서 생성/보유하므로 항상 알고 있다. 주어진 executor(tx 또는 풀 db)를 그대로 사용해
// 같은 트랜잭션 안에서 방금 쓴 행을 읽도록 한다.

import { eq } from 'drizzle-orm'
import type { DrizzleExecutor } from './executor'

export async function selectById<T>(
  ex: DrizzleExecutor,
  // biome noExplicitAny는 off — drizzle 테이블/컬럼 제네릭은 호출부 캐스트로 좁힌다
  table: any,
  pkColumn: any,
  id: string
): Promise<T> {
  const rows = await ex.select().from(table).where(eq(pkColumn, id)).limit(1)
  return rows[0] as T
}
