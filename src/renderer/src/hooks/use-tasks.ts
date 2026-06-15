import { useQueries, useQueryClient } from '@tanstack/react-query'
import { IpcChannel } from '@/interface/CoreInterface'
import { queryKeys } from '@/lib/queryKeys'
import { invokeApi, useApiMutation, useApiQuery } from './use-api'

/**
 * 프로젝트의 이슈별 체크리스트(Tasks)를 조회한다.
 * 이슈 목록은 단일 쿼리, 이슈별 task는 useQueries로 병렬 조회(N+1을 React Query 캐시로 관리).
 * 이슈 목록 쿼리키는 useProjectIssues와 동일하여 캐시를 공유한다(중복 패칭 없음).
 */
export function useProjectTasks(projectId: string | undefined) {
  const issuesQuery = useApiQuery(
    queryKeys.issues.byProject(projectId ?? ''),
    IpcChannel.ISSUE_LIST,
    { projectId: projectId ?? '' },
    { enabled: !!projectId }
  )
  const issues = issuesQuery.data ?? []

  const taskQueries = useQueries({
    queries: issues.map((issue) => ({
      queryKey: queryKeys.tasks.byIssue(issue.issue_id),
      queryFn: () => invokeApi(IpcChannel.TASK_LIST, { issueId: issue.issue_id })
    }))
  })

  const issuesWithTasks = issues.map((issue, i) => ({ issue, tasks: taskQueries[i]?.data ?? [] }))
  const isLoading = issuesQuery.isLoading || taskQueries.some((q) => q.isLoading)

  return { issuesWithTasks, isLoading }
}

/** task 생성/수정/삭제 뮤테이션 묶음. 성공 시 모든 task 쿼리를 무효화한다. */
export function useTaskMutations() {
  const queryClient = useQueryClient()
  const invalidate = () => queryClient.invalidateQueries({ queryKey: queryKeys.tasks.all })

  const create = useApiMutation(IpcChannel.TASK_CREATE, { onSuccess: invalidate })
  const update = useApiMutation(IpcChannel.TASK_UPDATE, { onSuccess: invalidate })
  const remove = useApiMutation(IpcChannel.TASK_DELETE, { onSuccess: invalidate })

  return { create, update, remove }
}
