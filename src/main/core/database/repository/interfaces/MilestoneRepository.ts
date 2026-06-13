// 마일스톤 리포지토리 인터페이스

export interface CreateMilestoneData {
  milestoneId: string
  projectId: string
  milestoneTitle: string
  milestoneDesc?: string | null
  milestoneDueDate?: Date | null
}

export interface UpdateMilestoneData {
  milestoneTitle?: string
  milestoneDesc?: string | null
  milestoneDueDate?: Date | null
  milestoneStatus?: string
}

export interface MilestoneRecord {
  milestone_id: string
  project_id: string
  milestone_title: string
  milestone_desc: string | null
  milestone_due_date: Date | null
  milestone_status: string | null
  milestone_created_at: Date | null
  milestone_updated_at: Date | null
}

export interface MilestoneRepository {
  create(data: CreateMilestoneData): Promise<MilestoneRecord>
  findByProject(projectId: string): Promise<MilestoneRecord[]>
  findById(milestoneId: string): Promise<MilestoneRecord | null>
  update(milestoneId: string, data: UpdateMilestoneData): Promise<MilestoneRecord>
  delete(milestoneId: string): Promise<boolean>
}
