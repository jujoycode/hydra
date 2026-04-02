import { and, eq } from 'drizzle-orm'
import type { NodePgDatabase } from 'drizzle-orm/node-postgres'
import { CoreUtil } from '../../../util/CoreUtil'
import * as schema from '../../schema/drizzle/schema'
import type { CreateLabelData, LabelRecord, LabelRepository } from '../interfaces/LabelRepository'

const { labels, issuesLabelsLink } = schema

export class DrizzleLabelRepository implements LabelRepository {
  constructor(private db: NodePgDatabase<typeof schema>) {}

  async create(data: CreateLabelData): Promise<LabelRecord> {
    const rows = await this.db
      .insert(labels)
      .values({
        label_id: data.labelId,
        label_name: data.labelName,
        label_color: data.labelColor
      })
      .returning()
    return rows[0] as LabelRecord
  }

  async findAll(): Promise<LabelRecord[]> {
    const rows = await this.db.select().from(labels)
    return rows as LabelRecord[]
  }

  async update(labelId: string, data: { labelName?: string; labelColor?: string }): Promise<LabelRecord> {
    const updateData: Record<string, string> = {}
    if (data.labelName !== undefined) updateData.label_name = data.labelName
    if (data.labelColor !== undefined) updateData.label_color = data.labelColor

    const rows = await this.db.update(labels).set(updateData).where(eq(labels.label_id, labelId)).returning()
    return rows[0] as LabelRecord
  }

  async delete(labelId: string): Promise<boolean> {
    // 연결 테이블에서 먼저 삭제
    await this.db.delete(issuesLabelsLink).where(eq(issuesLabelsLink.label_id, labelId))
    await this.db.delete(labels).where(eq(labels.label_id, labelId))
    return true
  }

  async linkToIssue(issueId: string, labelId: string): Promise<void> {
    await this.db.insert(issuesLabelsLink).values({
      issue_label_link_id: CoreUtil.getUuid(),
      issue_id: issueId,
      label_id: labelId
    })
  }

  async unlinkFromIssue(issueId: string, labelId: string): Promise<void> {
    await this.db
      .delete(issuesLabelsLink)
      .where(and(eq(issuesLabelsLink.issue_id, issueId), eq(issuesLabelsLink.label_id, labelId)))
  }

  async findByIssue(issueId: string): Promise<LabelRecord[]> {
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
