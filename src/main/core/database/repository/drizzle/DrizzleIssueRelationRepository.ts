import { eq, or } from 'drizzle-orm'
import * as pgSchema from '../../schema/drizzle/schema'
import type {
  CreateRelationData,
  IssueRelationRecord,
  IssueRelationRepository
} from '../interfaces/IssueRelationRepository'
import type { DrizzleDb, DrizzleSchema } from './executor'
import { selectById } from './readAfterWrite'

export class DrizzleIssueRelationRepository implements IssueRelationRepository {
  constructor(
    private db: DrizzleDb,
    private schema: DrizzleSchema = pgSchema
  ) {}

  async create(data: CreateRelationData): Promise<IssueRelationRecord> {
    const { issueRelations } = this.schema
    await this.db.insert(issueRelations).values({
      relation_id: data.relationId,
      source_issue_id: data.sourceIssueId,
      target_issue_id: data.targetIssueId,
      relation_type: data.relationType,
      relation_created_at: new Date()
    })
    return selectById<IssueRelationRecord>(this.db, issueRelations, issueRelations.relation_id, data.relationId)
  }

  async findByIssue(issueId: string): Promise<IssueRelationRecord[]> {
    const { issueRelations } = this.schema
    const rows = await this.db
      .select()
      .from(issueRelations)
      .where(or(eq(issueRelations.source_issue_id, issueId), eq(issueRelations.target_issue_id, issueId)))
    return rows as IssueRelationRecord[]
  }

  async delete(relationId: string): Promise<boolean> {
    const { issueRelations } = this.schema
    await this.db.delete(issueRelations).where(eq(issueRelations.relation_id, relationId))
    return true
  }
}
