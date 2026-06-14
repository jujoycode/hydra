export type { ActivityLogRecord } from '../../database/repository/interfaces/ActivityLogRepository'

export interface ListActivityParams {
  entityType: string
  entityId: string
}
