import { useQueryClient } from '@tanstack/react-query'
import { IpcChannel } from '@/interface/CoreInterface'
import { queryKeys } from '@/lib/queryKeys'
import { useApiMutation, useApiQuery } from './use-api'

/** 워크스페이스의 전체 사용자(멤버) 목록을 조회한다. */
export function useUsers() {
  return useApiQuery(queryKeys.users.all, IpcChannel.AUTH_LIST_USERS, undefined)
}

/** 멤버 생성/삭제 및 초대코드 생성 뮤테이션. 멤버 변경 성공 시 목록 캐시를 무효화한다. */
export function useUserMutations() {
  const queryClient = useQueryClient()
  const invalidate = () => queryClient.invalidateQueries({ queryKey: queryKeys.users.all })

  const createMember = useApiMutation(IpcChannel.AUTH_CREATE_MEMBER, { onSuccess: invalidate })
  const deleteUser = useApiMutation(IpcChannel.AUTH_DELETE_USER, { onSuccess: invalidate })
  const generateInvite = useApiMutation(IpcChannel.INVITE_GENERATE)

  return { createMember, deleteUser, generateInvite }
}
