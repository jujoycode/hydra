import type { Issue as IssueRecord } from '@/interface/CoreInterface'
import type { IssueState } from '@/molecules/issues/IssueBadge'
import type { Issue } from '@/types/issue'

const ISSUE_STATES: readonly IssueState[] = ['backlog', 'in_progress', 'review', 'done', 'blocked']

const toIssueState = (status: string | null): IssueState => {
  // 레거시 'open' 값은 backlog로 별칭 처리 (DB는 free varchar라 마이그레이션 불필요)
  if (status === 'open') return 'backlog'
  return ISSUE_STATES.includes(status as IssueState) ? (status as IssueState) : 'backlog'
}

const toIssueType = (category: string | null): Issue['type'] => (category === 'bug' ? 'bug' : 'feature')

const toPriority = (priority: string | null): Issue['priority'] => {
  if (priority === 'low' || priority === 'medium' || priority === 'high' || priority === 'urgent') return priority
  return undefined
}

/**
 * main 프로세스의 IssueRecord(snake_case)를 렌더러 Issue(IssueTable 입력)로 변환한다.
 */
export const mapIssueRecordToIssue = (record: IssueRecord): Issue => ({
  id: record.issue_id,
  type: toIssueType(record.issue_category),
  key: record.issue_key,
  title: record.issue_title,
  created: new Date(record.issue_created_at ?? 0),
  updated: new Date(record.issue_updated_at ?? 0),
  reporter: {
    name: record.issue_created_by ?? 'Unknown',
    avatar: ''
  },
  assignee: record.issue_assigned_to ?? '',
  state: toIssueState(record.issue_status),
  description: record.issue_desc ?? undefined,
  priority: toPriority(record.issue_priority)
})
