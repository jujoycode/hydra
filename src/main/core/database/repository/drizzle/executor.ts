import type { NodePgDatabase } from 'drizzle-orm/node-postgres'
import type * as schema from '../../schema/drizzle/schema'

export type DrizzleDb = NodePgDatabase<typeof schema>
// tx 핸들 타입을 transaction 콜백 인자에서 직접 추출 (drizzle 내부 제네릭에 의존하지 않음)
export type DrizzleTx = Parameters<Parameters<DrizzleDb['transaction']>[0]>[0]
export type DrizzleExecutor = DrizzleDb | DrizzleTx
