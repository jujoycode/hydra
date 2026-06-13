import type { Issue as IssueRecord, IssueStatus } from '@/interface/CoreInterface'
import { ISSUE_PRIORITIES, ISSUE_STATUSES } from '@/interface/CoreInterface'
import type { Issue } from '@/types/issue'

const toIssueState = (status: string | null): IssueStatus => {
  // 레거시 'open' 값은 backlog로 별칭 처리 (DB는 free varchar라 마이그레이션 불필요)
  if (status === 'open') return 'backlog'
  return ISSUE_STATUSES.includes(status as IssueStatus) ? (status as IssueStatus) : 'backlog'
}

const toIssueType = (category: string | null): Issue['type'] => (category === 'bug' ? 'bug' : 'feature')

const toPriority = (priority: string | null): Issue['priority'] =>
  ISSUE_PRIORITIES.includes(priority as (typeof ISSUE_PRIORITIES)[number]) ? (priority as Issue['priority']) : undefined

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
