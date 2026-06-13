// Drizzle 기반 이슈 리포지토리 구현

import { and, asc, desc, eq, sql } from 'drizzle-orm'
import * as pgSchema from '../../schema/drizzle/schema'
import type {
  CreateIssueData,
  IssueFilterOptions,
  IssueRecord,
  IssueRepository,
  PaginatedResult,
  UpdateIssueData
} from '../interfaces/IssueRepository'
import type { DrizzleDb, DrizzleSchema } from './executor'
import { caseInsensitiveLike } from './portable'
import { selectById } from './readAfterWrite'

export class DrizzleIssueRepository implements IssueRepository {
  constructor(
    private db: DrizzleDb,
    private schema: DrizzleSchema = pgSchema
  ) {}

  async create(data: CreateIssueData): Promise<IssueRecord> {
    const { issues } = this.schema
    const now = new Date()
    await this.db.insert(issues).values({
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
    return selectById<IssueRecord>(this.db, issues, issues.issue_id, data.issueId)
  }

  async findById(issueId: string): Promise<IssueRecord | null> {
    const { issues } = this.schema
    const rows = await this.db.select().from(issues).where(eq(issues.issue_id, issueId)).limit(1)
    return (rows[0] as IssueRecord) ?? null
  }

  async findByProject(projectId: string): Promise<IssueRecord[]> {
    const { issues } = this.schema
    const rows = await this.db.select().from(issues).where(eq(issues.project_id, projectId))
    return rows as IssueRecord[]
  }

  async update(issueId: string, data: UpdateIssueData): Promise<IssueRecord> {
    const { issues } = this.schema
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

    await this.db.update(issues).set(values).where(eq(issues.issue_id, issueId))
    return selectById<IssueRecord>(this.db, issues, issues.issue_id, issueId)
  }

  async delete(issueId: string): Promise<boolean> {
    const { issues } = this.schema
    await this.db.delete(issues).where(eq(issues.issue_id, issueId))
    return true
  }

  async countByProject(projectId: string): Promise<number> {
    const { issues } = this.schema
    const rows = await this.db
      .select({ count: sql<number>`count(*)` })
      .from(issues)
      .where(eq(issues.project_id, projectId))
    return Number(rows[0].count)
  }

  async findByProjectFiltered(projectId: string, options: IssueFilterOptions): Promise<PaginatedResult<IssueRecord>> {
    const { issues } = this.schema
    const conditions = [eq(issues.project_id, projectId)]

    if (options.status) conditions.push(eq(issues.issue_status, options.status))
    if (options.priority) conditions.push(eq(issues.issue_priority, options.priority))
    if (options.category) conditions.push(eq(issues.issue_category, options.category))
    if (options.assignedTo) conditions.push(eq(issues.issue_assigned_to, options.assignedTo))
    if (options.search) conditions.push(caseInsensitiveLike(issues.issue_title, options.search))

    const where = and(...conditions)

    // Count total
    const countRows = await this.db.select({ count: sql<number>`count(*)` }).from(issues).where(where)
    const total = Number(countRows[0].count)

    // Sort
    const sortColumn = this.getSortColumn(issues, options.sortBy)
    const orderFn = options.sortOrder === 'asc' ? asc : desc

    // Paginate
    const page = options.page ?? 1
    const pageSize = options.pageSize ?? 20
    const offset = (page - 1) * pageSize

    const rows = await this.db
      .select()
      .from(issues)
      .where(where)
      .orderBy(orderFn(sortColumn))
      .limit(pageSize)
      .offset(offset)

    return {
      data: rows as IssueRecord[],
      total,
      page,
      pageSize
    }
  }

  private getSortColumn(issues: DrizzleSchema['issues'], sortBy?: string) {
    switch (sortBy) {
      case 'title':
        return issues.issue_title
      case 'status':
        return issues.issue_status
      case 'priority':
        return issues.issue_priority
      case 'created':
        return issues.issue_created_at
      case 'updated':
        return issues.issue_updated_at
      default:
        return issues.issue_created_at
    }
  }
}
