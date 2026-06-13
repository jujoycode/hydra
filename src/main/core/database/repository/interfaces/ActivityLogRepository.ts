// 활동 로그 리포지토리 인터페이스

export interface CreateActivityLogData {
  activityId: string
  entityType: string
  entityId: string
  action: string
  actorId?: string | null
  metadata?: string | null
}

export interface ActivityLogRecord {
  activity_id: string
  activity_entity_type: string
  activity_entity_id: string
  activity_action: string
  activity_actor_id: string | null
  activity_metadata: string | null
  activity_created_at: Date | null
}

export interface ActivityLogRepository {
  create(data: CreateActivityLogData): Promise<ActivityLogRecord>
  findByEntity(entityType: string, entityId: string): Promise<ActivityLogRecord[]>
}
