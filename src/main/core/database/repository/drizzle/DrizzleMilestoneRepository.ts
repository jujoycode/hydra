import { asc, eq } from 'drizzle-orm'
import * as schema from '../../schema/drizzle/schema'
import type { DrizzleDb } from './executor'
import type {
  CreateMilestoneData,
  MilestoneRecord,
  MilestoneRepository,
  UpdateMilestoneData
} from '../interfaces/MilestoneRepository'

const { milestones } = schema

export class DrizzleMilestoneRepository implements MilestoneRepository {
  constructor(private db: DrizzleDb) {}

  async create(data: CreateMilestoneData): Promise<MilestoneRecord> {
    const now = new Date()
    const rows = await this.db
      .insert(milestones)
      .values({
        milestone_id: data.milestoneId,
        project_id: data.projectId,
        milestone_title: data.milestoneTitle,
        milestone_desc: data.milestoneDesc ?? null,
        milestone_due_date: data.milestoneDueDate ?? null,
        milestone_created_at: now,
        milestone_updated_at: now
      })
      .returning()
    return rows[0] as MilestoneRecord
  }

  async findByProject(projectId: string): Promise<MilestoneRecord[]> {
    const rows = await this.db
      .select()
      .from(milestones)
      .where(eq(milestones.project_id, projectId))
      .orderBy(asc(milestones.milestone_due_date))
    return rows as MilestoneRecord[]
  }

  async findById(milestoneId: string): Promise<MilestoneRecord | null> {
    const rows = await this.db.select().from(milestones).where(eq(milestones.milestone_id, milestoneId))
    return (rows[0] as MilestoneRecord) ?? null
  }

  async update(milestoneId: string, data: UpdateMilestoneData): Promise<MilestoneRecord> {
    const updateData: Record<string, unknown> = {
      milestone_updated_at: new Date()
    }
    if (data.milestoneTitle !== undefined) updateData.milestone_title = data.milestoneTitle
    if (data.milestoneDesc !== undefined) updateData.milestone_desc = data.milestoneDesc
    if (data.milestoneDueDate !== undefined) updateData.milestone_due_date = data.milestoneDueDate
    if (data.milestoneStatus !== undefined) updateData.milestone_status = data.milestoneStatus

    const rows = await this.db
      .update(milestones)
      .set(updateData)
      .where(eq(milestones.milestone_id, milestoneId))
      .returning()
    return rows[0] as MilestoneRecord
  }

  async delete(milestoneId: string): Promise<boolean> {
    await this.db.delete(milestones).where(eq(milestones.milestone_id, milestoneId))
    return true
  }
}
