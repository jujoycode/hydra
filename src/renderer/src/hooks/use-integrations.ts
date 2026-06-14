import { useQueryClient } from '@tanstack/react-query'
import { IpcChannel } from '@/interface/CoreInterface'
import { queryKeys } from '@/lib/queryKeys'
import { useApiMutation, useApiQuery } from './use-api'

/** 워크스페이스의 서비스 인테그레이션(Slack/GitHub) 목록을 조회한다. */
export function useIntegrations() {
  return useApiQuery(queryKeys.integrations.all, IpcChannel.INTEGRATION_LIST, undefined)
}

/** 인테그레이션 저장/슬랙 테스트 뮤테이션. 저장 성공 시 목록 캐시를 무효화한다. */
export function useIntegrationMutations() {
  const queryClient = useQueryClient()

  const save = useApiMutation(IpcChannel.INTEGRATION_SAVE, {
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.integrations.all })
  })
  const testSlack = useApiMutation(IpcChannel.INTEGRATION_TEST_SLACK)

  return { save, testSlack }
}
