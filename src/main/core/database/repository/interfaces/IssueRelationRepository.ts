export interface CreateRelationData {
  relationId: string
  sourceIssueId: string
  targetIssueId: string
  relationType: string
}

export interface IssueRelationRecord {
  relation_id: string
  source_issue_id: string
  target_issue_id: string
  relation_type: string
  relation_created_at: Date | null
}

export interface IssueRelationRepository {
  create(data: CreateRelationData): Promise<IssueRelationRecord>
  findByIssue(issueId: string): Promise<IssueRelationRecord[]>
  delete(relationId: string): Promise<boolean>
}
