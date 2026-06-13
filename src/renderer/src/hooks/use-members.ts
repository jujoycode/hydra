import { IpcChannel } from '@/interface/CoreInterface'
import { queryKeys } from '@/lib/queryKeys'
import { useApiQuery } from './use-api'

/** 프로젝트에 속한 멤버 목록 (담당자 후보 등에 사용). */
export function useProjectMembers(projectId: string | undefined) {
  return useApiQuery(
    queryKeys.projects.members(projectId ?? ''),
    IpcChannel.PROJECT_LIST_MEMBERS,
    {
      projectId: projectId ?? ''
    },
    {
      enabled: !!projectId
    }
  )
}
