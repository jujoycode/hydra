import type { NodePgDatabase } from 'drizzle-orm/node-postgres'
import type * as schema from '../../schema/drizzle/schema'

// 포터블 쿼리 빌더의 "타입 기준"은 pg로 둔다. MySQL 연결은 구조적으로 동일한
// 포터블 서브셋(select/insert/update/delete/transaction)만 사용하므로
// 어댑터 와이어링에서 DrizzleDb/DrizzleSchema로 캐스트해 단일 리포지토리 셋을 공유한다.
export type DrizzleDb = NodePgDatabase<typeof schema>
// tx 핸들 타입을 transaction 콜백 인자에서 직접 추출 (drizzle 내부 제네릭에 의존하지 않음)
export type DrizzleTx = Parameters<Parameters<DrizzleDb['transaction']>[0]>[0]
export type DrizzleExecutor = DrizzleDb | DrizzleTx
// 주입 가능한 스키마 집합 (pg 스키마 모듈의 형태가 규범)
export type DrizzleSchema = typeof schema
