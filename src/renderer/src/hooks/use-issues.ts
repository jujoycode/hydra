import { useQueryClient } from '@tanstack/react-query'
import { IpcChannel } from '@/interface/CoreInterface'
import { mapIssueRecordToIssue } from '@/lib/mapIssue'
import { queryKeys } from '@/lib/queryKeys'
import { useApiMutation, useApiQuery } from './use-api'

/** 이슈 생성 뮤테이션. 성공 시 이슈 쿼리를 모두 무효화한다(목록/내 이슈/대시보드 자동 갱신). */
export function useCreateIssue() {
  const queryClient = useQueryClient()
  return useApiMutation(IpcChannel.ISSUE_CREATE, {
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.issues.all })
  })
}

/** 프로젝트의 이슈 목록 (IssueTable 입력 형태로 매핑). */
export function useProjectIssues(projectId: string | undefined) {
  return useApiQuery(
    queryKeys.issues.byProject(projectId ?? ''),
    IpcChannel.ISSUE_LIST,
    { projectId: projectId ?? '' },
    {
      enabled: !!projectId,
      select: (records) => records.map(mapIssueRecordToIssue)
    }
  )
}

/** 현재 사용자에게 할당된 이슈 (전 프로젝트, 단일 쿼리). */
export function useMyIssues(userId: string | undefined) {
  return useApiQuery(
    queryKeys.issues.mine(userId ?? ''),
    IpcChannel.ISSUE_LIST_ASSIGNED,
    { userId: userId ?? '' },
    {
      enabled: !!userId,
      select: (records) => records.map(mapIssueRecordToIssue)
    }
  )
}

/** 대시보드용 — 사용자가 속한 프로젝트의 모든 이슈(원본 레코드, 단일 쿼리). */
export function useDashboardIssues(userId: string | undefined) {
  return useApiQuery(
    queryKeys.issues.dashboard(userId ?? ''),
    IpcChannel.ISSUE_LIST_MEMBER_PROJECTS,
    {
      userId: userId ?? ''
    },
    {
      enabled: !!userId
    }
  )
}
