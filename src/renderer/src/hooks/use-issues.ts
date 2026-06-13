import { useQuery } from '@tanstack/react-query'
import type { Issue as IssueRecord, Project } from '@/interface/CoreInterface'
import { IpcChannel } from '@/interface/CoreInterface'
import { mapIssueRecordToIssue } from '@/lib/mapIssue'
import { queryKeys } from '@/lib/queryKeys'
import type { Issue } from '@/types/issue'
import { invokeApi, useApiQuery } from './use-api'

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

/** 현재 사용자에게 할당된 이슈 (전 프로젝트 횡단). */
export function useMyIssues(userId: string | undefined) {
  return useQuery<Issue[], Error>({
    queryKey: queryKeys.issues.mine(userId ?? ''),
    enabled: !!userId,
    queryFn: async () => {
      const projects = await invokeApi(IpcChannel.PROJECT_LIST, { userId: userId as string })
      const records: IssueRecord[] = []
      for (const project of projects as Project[]) {
        const issues = await invokeApi(IpcChannel.ISSUE_LIST, { projectId: project.project_id, assignedTo: userId })
        records.push(...issues)
      }
      return records.map(mapIssueRecordToIssue)
    }
  })
}
