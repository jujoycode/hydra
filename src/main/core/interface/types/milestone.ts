import type { MilestoneRecord } from '../../database/repository/interfaces/MilestoneRepository'

export type Milestone = MilestoneRecord

export interface CreateMilestoneParams {
  projectId: string
  milestoneTitle: string
  milestoneDesc?: string
  milestoneDueDate?: string // ISO string
}

export interface UpdateMilestoneParams {
  milestoneId: string
  milestoneTitle?: string
  milestoneDesc?: string
  milestoneDueDate?: string
  milestoneStatus?: string
}

export interface DeleteMilestoneParams {
  milestoneId: string
}

export interface ListMilestonesParams {
  projectId: string
}
