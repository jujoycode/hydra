import { IpcChannel } from '@/interface/CoreInterface'
import { mapIssueRecordToIssue } from '@/lib/mapIssue'
import { queryKeys } from '@/lib/queryKeys'
import { useApiQuery } from './use-api'

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
