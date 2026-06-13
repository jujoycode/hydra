import { renderHook, waitFor } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import type { Issue as IssueRecord } from '@/interface/CoreInterface'
import { IpcChannel } from '@/interface/CoreInterface'
import { installMockCallApi } from '../__testutils__/mockCallApi'
import { createQueryWrapper } from '../__testutils__/queryWrapper'
import { useMyIssues, useProjectIssues } from './use-issues'

const record = (overrides: Partial<IssueRecord> = {}): IssueRecord =>
  ({
    issue_id: 'i1',
    issue_key: 'HYD-1',
    issue_title: 't',
    issue_desc: null,
    issue_status: 'open',
    issue_priority: 'high',
    issue_category: 'bug',
    issue_created_by: 'u1',
    issue_assigned_to: 'u2',
    issue_created_at: new Date(),
    issue_updated_at: new Date(),
    ...overrides
  }) as IssueRecord

describe('useProjectIssues', () => {
  it('ISSUE_LIST를 projectId로 호출하고 IssueRecord를 Issue로 매핑한다', async () => {
    const callApi = installMockCallApi({
      [IpcChannel.ISSUE_LIST]: () => ({ data: [record()], error: null })
    })
    const { result } = renderHook(() => useProjectIssues('p1'), { wrapper: createQueryWrapper() })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(callApi).toHaveBeenCalledWith(IpcChannel.ISSUE_LIST, { projectId: 'p1' })
    expect(result.current.data?.[0].state).toBe('backlog') // 레거시 open → backlog 매핑
    expect(result.current.data?.[0].type).toBe('bug')
  })

  it('projectId가 없으면 쿼리를 실행하지 않는다', () => {
    const callApi = installMockCallApi()
    const { result } = renderHook(() => useProjectIssues(undefined), { wrapper: createQueryWrapper() })
    expect(result.current.fetchStatus).toBe('idle')
    expect(callApi).not.toHaveBeenCalled()
  })
})

describe('useMyIssues', () => {
  it('ISSUE_LIST_ASSIGNED를 userId로 호출한다', async () => {
    const callApi = installMockCallApi({
      [IpcChannel.ISSUE_LIST_ASSIGNED]: () => ({ data: [record({ issue_id: 'mine' })], error: null })
    })
    const { result } = renderHook(() => useMyIssues('u2'), { wrapper: createQueryWrapper() })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(callApi).toHaveBeenCalledWith(IpcChannel.ISSUE_LIST_ASSIGNED, { userId: 'u2' })
    expect(result.current.data?.[0].id).toBe('mine')
  })
})
