// 이슈 리포지토리 인터페이스

export interface CreateIssueData {
  issueId: string
  projectId: string
  issueTitle: string
  issueKey: string
  issueDesc?: string | null
  issueStatus?: string
  issuePriority?: string
  issueCategory?: string
  createdBy: string
  assignedTo?: string | null
}

export interface UpdateIssueData {
  issueTitle?: string
  issueDesc?: string | null
  issueStatus?: string
  issuePriority?: string
  issueCategory?: string
  modifiedBy?: string
  assignedTo?: string | null
}

export interface IssueRecord {
  issue_id: string
  project_id: string
  issue_title: string
  issue_key: string
  issue_desc: string | null
  issue_status: string | null
  issue_priority: string | null
  issue_category: string | null
  issue_created_by: string | null
  issue_modified_by: string | null
  issue_assigned_to: string | null
  issue_created_at: Date | null
  issue_updated_at: Date | null
}

export interface IssueRepository {
  create(data: CreateIssueData): Promise<IssueRecord>
  findById(issueId: string): Promise<IssueRecord | null>
  findByProject(projectId: string): Promise<IssueRecord[]>
  update(issueId: string, data: UpdateIssueData): Promise<IssueRecord>
  delete(issueId: string): Promise<boolean>
  countByProject(projectId: string): Promise<number>
}
