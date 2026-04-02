import type { IssueRecord } from '../../database/repository/interfaces/IssueRepository'

export type { IssueFilterOptions, PaginatedResult } from '../../database/repository/interfaces/IssueRepository'

export type Issue = IssueRecord

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
