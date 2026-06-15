import { describe, expect, it } from 'vitest'
import type { Issue as IssueRecord } from '@/interface/CoreInterface'
import { mapIssueRecordToIssue } from './mapIssue'

const baseRecord = (overrides: Partial<IssueRecord> = {}): IssueRecord =>
  ({
    issue_id: 'i1',
    issue_key: 'HYD-1',
    issue_title: 'title',
    issue_desc: null,
    issue_status: 'backlog',
    issue_priority: 'medium',
    issue_category: 'feature',
    issue_created_by: 'u1',
    issue_assigned_to: 'u2',
    issue_created_at: new Date('2026-01-01'),
    issue_updated_at: new Date('2026-01-02'),
    ...overrides
  }) as IssueRecord

describe('mapIssueRecordToIssue', () => {
  it('레거시 open 상태를 backlog로 별칭 처리한다', () => {
    expect(mapIssueRecordToIssue(baseRecord({ issue_status: 'open' })).state).toBe('backlog')
  })

  it('알 수 없는 상태는 backlog로 폴백한다', () => {
    expect(mapIssueRecordToIssue(baseRecord({ issue_status: 'wat' })).state).toBe('backlog')
  })

  it('유효한 상태는 그대로 매핑한다', () => {
    expect(mapIssueRecordToIssue(baseRecord({ issue_status: 'in_progress' })).state).toBe('in_progress')
  })

  it('category bug/그 외를 type으로 매핑한다', () => {
    expect(mapIssueRecordToIssue(baseRecord({ issue_category: 'bug' })).type).toBe('bug')
    expect(mapIssueRecordToIssue(baseRecord({ issue_category: 'chore' })).type).toBe('feature')
  })

  it('유효하지 않은 우선순위는 undefined로 둔다', () => {
    expect(mapIssueRecordToIssue(baseRecord({ issue_priority: 'nope' })).priority).toBeUndefined()
    expect(mapIssueRecordToIssue(baseRecord({ issue_priority: 'high' })).priority).toBe('high')
  })

  it('식별/기본 필드를 매핑한다', () => {
    const issue = mapIssueRecordToIssue(baseRecord())
    expect(issue.id).toBe('i1')
    expect(issue.key).toBe('HYD-1')
    expect(issue.assignee).toBe('u2')
  })
})
