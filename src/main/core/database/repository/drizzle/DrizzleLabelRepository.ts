import { and, eq } from 'drizzle-orm'
import { CoreUtil } from '../../../util/CoreUtil'
import * as pgSchema from '../../schema/drizzle/schema'
import type { CreateLabelData, LabelRecord, LabelRepository } from '../interfaces/LabelRepository'
import type { DrizzleDb, DrizzleSchema } from './executor'
import { selectById } from './readAfterWrite'

export class DrizzleLabelRepository implements LabelRepository {
  constructor(
    private db: DrizzleDb,
    private schema: DrizzleSchema = pgSchema
  ) {}

  async create(data: CreateLabelData): Promise<LabelRecord> {
    const { labels } = this.schema
    await this.db.insert(labels).values({
      label_id: data.labelId,
      label_name: data.labelName,
      label_color: data.labelColor
    })
    return selectById<LabelRecord>(this.db, labels, labels.label_id, data.labelId)
  }

  async findAll(): Promise<LabelRecord[]> {
    const { labels } = this.schema
    const rows = await this.db.select().from(labels)
    return rows as LabelRecord[]
  }

  async update(labelId: string, data: { labelName?: string; labelColor?: string }): Promise<LabelRecord> {
    const { labels } = this.schema
    const updateData: Record<string, string> = {}
    if (data.labelName !== undefined) updateData.label_name = data.labelName
    if (data.labelColor !== undefined) updateData.label_color = data.labelColor

    await this.db.update(labels).set(updateData).where(eq(labels.label_id, labelId))
    return selectById<LabelRecord>(this.db, labels, labels.label_id, labelId)
  }

  async delete(labelId: string): Promise<boolean> {
    const { labels, issuesLabelsLink } = this.schema
    // 연결 테이블에서 먼저 삭제
    await this.db.delete(issuesLabelsLink).where(eq(issuesLabelsLink.label_id, labelId))
    await this.db.delete(labels).where(eq(labels.label_id, labelId))
    return true
  }

  async linkToIssue(issueId: string, labelId: string): Promise<void> {
    const { issuesLabelsLink } = this.schema
    await this.db.insert(issuesLabelsLink).values({
      issue_label_link_id: CoreUtil.getUuid(),
      issue_id: issueId,
      label_id: labelId
    })
  }

  async unlinkFromIssue(issueId: string, labelId: string): Promise<void> {
    const { issuesLabelsLink } = this.schema
    await this.db
      .delete(issuesLabelsLink)
      .where(and(eq(issuesLabelsLink.issue_id, issueId), eq(issuesLabelsLink.label_id, labelId)))
  }

  async findByIssue(issueId: string): Promise<LabelRecord[]> {
    const { labels, issuesLabelsLink } = this.schema
    const rows = await this.db
      .select({
        label_id: labels.label_id,
        label_name: labels.label_name,
        label_color: labels.label_color,
        label_created_at: labels.label_created_at
      })
      .from(issuesLabelsLink)
      .innerJoin(labels, eq(issuesLabelsLink.label_id, labels.label_id))
      .where(eq(issuesLabelsLink.issue_id, issueId))
    return rows as LabelRecord[]
  }
}
