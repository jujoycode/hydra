import { useQueryClient } from '@tanstack/react-query'
import { IpcChannel } from '@/interface/CoreInterface'
import { queryKeys } from '@/lib/queryKeys'
import { useApiMutation, useApiQuery } from './use-api'

/** 사용자가 접근 가능한 프로젝트 목록을 조회한다(단일 출처: React Query). */
export function useProjects(userId: string | undefined) {
  return useApiQuery(queryKeys.projects.all, IpcChannel.PROJECT_LIST, { userId: userId ?? '' }, { enabled: !!userId })
}

/** 프로젝트 생성 뮤테이션. 성공 시 목록 캐시를 무효화한다. */
export function useCreateProject() {
  const queryClient = useQueryClient()
  return useApiMutation(IpcChannel.PROJECT_CREATE, {
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.projects.all })
  })
}
