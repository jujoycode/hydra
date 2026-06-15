import { useQueryClient } from '@tanstack/react-query'
import { IpcChannel } from '@/interface/CoreInterface'
import { queryKeys } from '@/lib/queryKeys'
import { useApiMutation, useApiQuery } from './use-api'

/** 프로젝트의 마일스톤 목록을 조회한다. */
export function useMilestones(projectId: string | undefined) {
  return useApiQuery(
    queryKeys.milestones.byProject(projectId ?? ''),
    IpcChannel.MILESTONE_LIST,
    { projectId: projectId ?? '' },
    { enabled: !!projectId }
  )
}

/** 마일스톤 생성 뮤테이션. 성공 시 해당 프로젝트의 마일스톤 캐시를 무효화한다. */
export function useMilestoneMutations(projectId: string | undefined) {
  const queryClient = useQueryClient()

  const create = useApiMutation(IpcChannel.MILESTONE_CREATE, {
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.milestones.byProject(projectId ?? '') })
  })

  return { create }
}
