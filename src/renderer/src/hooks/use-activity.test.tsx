import { renderHook, waitFor } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { IpcChannel } from '@/interface/CoreInterface'
import { installMockCallApi } from '../__testutils__/mockCallApi'
import { createQueryWrapper } from '../__testutils__/queryWrapper'
import { useActivityLog } from './use-activity'

describe('useActivityLog', () => {
  it('ACTIVITY_LIST를 entityType/entityId로 호출한다', async () => {
    const callApi = installMockCallApi({
      [IpcChannel.ACTIVITY_LIST]: () => ({
        data: [
          {
            activity_id: 'a1',
            activity_entity_type: 'issue',
            activity_entity_id: 'i1',
            activity_action: 'status_changed',
            activity_actor_id: null,
            activity_metadata: null,
            activity_created_at: null
          }
        ],
        error: null
      })
    })
    const { result } = renderHook(() => useActivityLog('issue', 'i1'), { wrapper: createQueryWrapper() })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(callApi).toHaveBeenCalledWith(IpcChannel.ACTIVITY_LIST, { entityType: 'issue', entityId: 'i1' })
    expect(result.current.data?.[0].activity_action).toBe('status_changed')
  })

  it('entityId가 없으면 실행하지 않는다', () => {
    const callApi = installMockCallApi()
    const { result } = renderHook(() => useActivityLog('issue', undefined), { wrapper: createQueryWrapper() })
    expect(result.current.fetchStatus).toBe('idle')
    expect(callApi).not.toHaveBeenCalled()
  })
})
