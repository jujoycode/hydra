import { IpcChannel } from '@/interface/CoreInterface'
import { queryKeys } from '@/lib/queryKeys'
import { useApiQuery } from './use-api'

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
