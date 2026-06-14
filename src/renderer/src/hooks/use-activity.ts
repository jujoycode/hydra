import { IpcChannel } from '@/interface/CoreInterface'
import { queryKeys } from '@/lib/queryKeys'
import { useApiQuery } from './use-api'

/** 엔티티(예: 이슈)의 활동 로그를 최신순으로 조회한다. */
export function useActivityLog(entityType: string, entityId: string | undefined) {
  return useApiQuery(
    queryKeys.activity.byEntity(entityType, entityId ?? ''),
    IpcChannel.ACTIVITY_LIST,
    { entityType, entityId: entityId ?? '' },
    { enabled: !!entityId }
  )
}
