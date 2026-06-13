import { renderHook, waitFor } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { IpcChannel } from '@/interface/CoreInterface'
import { installMockCallApi } from '../__testutils__/mockCallApi'
import { createQueryWrapper } from '../__testutils__/queryWrapper'
import { useProjectMembers } from './use-members'

describe('useProjectMembers', () => {
  it('PROJECT_LIST_MEMBERS를 projectId로 호출한다', async () => {
    const callApi = installMockCallApi({
      [IpcChannel.PROJECT_LIST_MEMBERS]: () => ({
        data: [
          {
            user_id: 'u1',
            user_sn: 'u1',
            user_status: 'active',
            user_name: 'One',
            user_email: null,
            user_avatar_path: null,
            user_role: 'member',
            user_created_at: null,
            user_updated_at: null
          }
        ],
        error: null
      })
    })
    const { result } = renderHook(() => useProjectMembers('p1'), { wrapper: createQueryWrapper() })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(callApi).toHaveBeenCalledWith(IpcChannel.PROJECT_LIST_MEMBERS, { projectId: 'p1' })
    expect(result.current.data?.[0].user_id).toBe('u1')
  })

  it('projectId가 없으면 실행하지 않는다', () => {
    const callApi = installMockCallApi()
    const { result } = renderHook(() => useProjectMembers(undefined), { wrapper: createQueryWrapper() })
    expect(result.current.fetchStatus).toBe('idle')
    expect(callApi).not.toHaveBeenCalled()
  })
})
