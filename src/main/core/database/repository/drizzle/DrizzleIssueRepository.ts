// Drizzle 기반 이슈 리포지토리 구현

import { eq, sql } from 'drizzle-orm'
import type { NodePgDatabase } from 'drizzle-orm/node-postgres'
import * as schema from '../../schema/drizzle/schema'
import type { CreateIssueData, IssueRecord, IssueRepository, UpdateIssueData } from '../interfaces/IssueRepository'

const { issues } = schema

export class DrizzleIssueRepository implements IssueRepository {
  constructor(private db: NodePgDatabase<typeof schema>) {}

  async create(data: CreateIssueData): Promise<IssueRecord> {
    const now = new Date()
    const rows = await this.db
      .insert(issues)
      .values({
        issue_id: data.issueId,
        project_id: data.projectId,
        issue_title: data.issueTitle,
        issue_key: data.issueKey,
        issue_desc: data.issueDesc ?? null,
        issue_status: data.issueStatus ?? null,
        issue_priority: data.issuePriority ?? null,
        issue_category: data.issueCategory ?? null,
        issue_created_by: data.createdBy,
        issue_assigned_to: data.assignedTo ?? null,
        issue_created_at: now,
        issue_updated_at: now
      })
      .returning()
    return rows[0] as IssueRecord
  }

  async findById(issueId: string): Promise<IssueRecord | null> {
    const rows = await this.db.select().from(issues).where(eq(issues.issue_id, issueId)).limit(1)
    return (rows[0] as IssueRecord) ?? null
  }

  async findByProject(projectId: string): Promise<IssueRecord[]> {
    const rows = await this.db.select().from(issues).where(eq(issues.project_id, projectId))
    return rows as IssueRecord[]
  }

  async update(issueId: string, data: UpdateIssueData): Promise<IssueRecord> {
    const values: Record<string, unknown> = {
      issue_updated_at: new Date()
    }
    if (data.issueTitle !== undefined) values.issue_title = data.issueTitle
    if (data.issueDesc !== undefined) values.issue_desc = data.issueDesc
    if (data.issueStatus !== undefined) values.issue_status = data.issueStatus
    if (data.issuePriority !== undefined) values.issue_priority = data.issuePriority
    if (data.issueCategory !== undefined) values.issue_category = data.issueCategory
    if (data.modifiedBy !== undefined) values.issue_modified_by = data.modifiedBy
    if (data.assignedTo !== undefined) values.issue_assigned_to = data.assignedTo

    const rows = await this.db.update(issues).set(values).where(eq(issues.issue_id, issueId)).returning()
    return rows[0] as IssueRecord
  }

  async delete(issueId: string): Promise<boolean> {
    await this.db.delete(issues).where(eq(issues.issue_id, issueId))
    return true
  }

  async countByProject(projectId: string): Promise<number> {
    const rows = await this.db
      .select({ count: sql<number>`count(*)` })
      .from(issues)
      .where(eq(issues.project_id, projectId))
    return Number(rows[0].count)
  }
}
