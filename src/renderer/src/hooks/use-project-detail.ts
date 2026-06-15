import { useQueryClient } from '@tanstack/react-query'
import { IpcChannel } from '@/interface/CoreInterface'
import { queryKeys } from '@/lib/queryKeys'
import { useApiMutation, useApiQuery } from './use-api'

/** 단일 프로젝트 상세를 조회한다(React Query). 스토어 기반 useProject와 별개. */
export function useProjectDetail(projectId: string | undefined) {
  return useApiQuery(
    queryKeys.projects.detail(projectId ?? ''),
    IpcChannel.PROJECT_GET,
    { projectId: projectId ?? '' },
    { enabled: !!projectId }
  )
}

/** 프로젝트의 이슈 원본 레코드 목록(매핑 없이). useProjectIssues와 캐시를 공유한다. */
export function useProjectIssueRecords(projectId: string | undefined) {
  return useApiQuery(
    queryKeys.issues.byProject(projectId ?? ''),
    IpcChannel.ISSUE_LIST,
    { projectId: projectId ?? '' },
    { enabled: !!projectId }
  )
}

/** 프로젝트 수정/삭제 뮤테이션. 성공 시 상세·목록 캐시를 무효화한다. */
export function useProjectMutations(projectId: string | undefined) {
  const queryClient = useQueryClient()
  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.projects.detail(projectId ?? '') })
    queryClient.invalidateQueries({ queryKey: queryKeys.projects.all })
  }

  const update = useApiMutation(IpcChannel.PROJECT_UPDATE, { onSuccess: invalidate })
  const remove = useApiMutation(IpcChannel.PROJECT_DELETE, { onSuccess: invalidate })

  return { update, remove }
}
