// Drizzle 기반 활동 로그 리포지토리 구현

import { and, desc, eq } from 'drizzle-orm'
import * as pgSchema from '../../schema/drizzle/schema'
import type {
  ActivityLogRecord,
  ActivityLogRepository,
  CreateActivityLogData
} from '../interfaces/ActivityLogRepository'
import type { DrizzleDb, DrizzleSchema } from './executor'
import { selectById } from './readAfterWrite'

export class DrizzleActivityLogRepository implements ActivityLogRepository {
  constructor(
    private db: DrizzleDb,
    private schema: DrizzleSchema = pgSchema
  ) {}

  async create(data: CreateActivityLogData): Promise<ActivityLogRecord> {
    const { activityLogs } = this.schema
    await this.db.insert(activityLogs).values({
      activity_id: data.activityId,
      activity_entity_type: data.entityType,
      activity_entity_id: data.entityId,
      activity_action: data.action,
      activity_actor_id: data.actorId ?? null,
      activity_metadata: data.metadata ?? null,
      activity_created_at: new Date()
    })
    return selectById<ActivityLogRecord>(this.db, activityLogs, activityLogs.activity_id, data.activityId)
  }

  // 엔티티별 활동을 최신순으로 반환 (타임라인용)
  async findByEntity(entityType: string, entityId: string): Promise<ActivityLogRecord[]> {
    const { activityLogs } = this.schema
    const rows = await this.db
      .select()
      .from(activityLogs)
      .where(and(eq(activityLogs.activity_entity_type, entityType), eq(activityLogs.activity_entity_id, entityId)))
      .orderBy(desc(activityLogs.activity_created_at))
    return rows as ActivityLogRecord[]
  }
}
