export interface CreateLabelData {
  labelId: string
  labelName: string
  labelColor: string
}

export interface LabelRecord {
  label_id: string
  label_name: string
  label_color: string
  label_created_at: Date | null
}

export interface LabelRepository {
  create(data: CreateLabelData): Promise<LabelRecord>
  findAll(): Promise<LabelRecord[]>
  update(labelId: string, data: { labelName?: string; labelColor?: string }): Promise<LabelRecord>
  delete(labelId: string): Promise<boolean>
  linkToIssue(issueId: string, labelId: string): Promise<void>
  unlinkFromIssue(issueId: string, labelId: string): Promise<void>
  findByIssue(issueId: string): Promise<LabelRecord[]>
}
