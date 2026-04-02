import type { IssueRecord } from '../../database/repository/interfaces/IssueRepository'

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
}

export interface GetIssueParams {
  issueId: string
}
