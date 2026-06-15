import type { IssueRecord } from '../../database/repository/interfaces/IssueRepository'

export type { IssueFilterOptions, PaginatedResult } from '../../database/repository/interfaces/IssueRepository'

export type Issue = IssueRecord

/**
 * 이슈 상태/우선순위/분류의 정규 값. main·renderer가 공유하는 단일 출처.
 * DB 컬럼은 자유 varchar이므로 런타임 강제는 하지 않고, UI 표시·검증·매핑의 기준으로 사용한다.
 */
export const ISSUE_STATUSES = ['backlog', 'in_progress', 'review', 'done', 'blocked'] as const
export type IssueStatus = (typeof ISSUE_STATUSES)[number]

export const ISSUE_PRIORITIES = ['low', 'medium', 'high', 'urgent'] as const
export type IssuePriority = (typeof ISSUE_PRIORITIES)[number]

export const ISSUE_CATEGORIES = ['bug', 'feature'] as const
export type IssueCategory = (typeof ISSUE_CATEGORIES)[number]

export interface DeleteIssueParams {
  issueId: string
}

export type UpdateIssueParams = DeleteIssueParams & {
  issueTitle: string
  issueDesc: string
  userId: string
  issueStatus?: string
  issuePriority?: string
  issueCategory?: string
  assignedTo?: string | null
}

export type CreateIssueParams = UpdateIssueParams & {
  projectId: string
  issueKey: string
  issuePriority?: string
  issueCategory?: string
  assignedTo?: string | null
}

// Params
export interface ListIssueParams {
  projectId: string
  // Optional filters
  status?: string
  priority?: string
  category?: string
  assignedTo?: string
  search?: string
  // Pagination
  page?: number
  pageSize?: number
  // Sort
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface GetIssueParams {
  issueId: string
}

export interface ListAssignedIssuesParams {
  userId: string
}

export interface ListMemberProjectIssuesParams {
  userId: string
}
