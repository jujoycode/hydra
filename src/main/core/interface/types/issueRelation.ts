import type { IssueRelationRecord } from '../../database/repository/interfaces/IssueRelationRepository'

export type IssueRelation = IssueRelationRecord

export interface CreateIssueRelationParams {
  sourceIssueId: string
  targetIssueId: string
  relationType: string
}

export interface DeleteIssueRelationParams {
  relationId: string
}

export interface ListIssueRelationsParams {
  issueId: string
}
