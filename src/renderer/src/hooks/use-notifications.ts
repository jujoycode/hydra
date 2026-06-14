import { useQueryClient } from '@tanstack/react-query'
import { IpcChannel } from '@/interface/CoreInterface'
import { queryKeys } from '@/lib/queryKeys'
import { useApiMutation, useApiQuery } from './use-api'

/** 사용자의 알림 목록을 최신순으로 조회한다. */
export function useNotifications(userId: string | undefined) {
  return useApiQuery(
    queryKeys.notifications.list(userId ?? ''),
    IpcChannel.NOTIFICATION_LIST,
    { userId: userId ?? '' },
    { enabled: !!userId }
  )
}

/**
 * 알림 변경(읽음/모두 읽음/삭제) 뮤테이션 묶음.
 * 성공 시 해당 사용자의 알림 목록·미읽음 카운트 캐시를 무효화한다.
 */
export function useNotificationMutations(userId: string | undefined) {
  const queryClient = useQueryClient()

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.notifications.list(userId ?? '') })
    queryClient.invalidateQueries({ queryKey: queryKeys.notifications.unreadCount(userId ?? '') })
  }

  const markRead = useApiMutation(IpcChannel.NOTIFICATION_MARK_READ, { onSuccess: invalidate })
  const markAllRead = useApiMutation(IpcChannel.NOTIFICATION_MARK_ALL_READ, { onSuccess: invalidate })
  const remove = useApiMutation(IpcChannel.NOTIFICATION_DELETE, { onSuccess: invalidate })

  return { markRead, markAllRead, remove }
}
