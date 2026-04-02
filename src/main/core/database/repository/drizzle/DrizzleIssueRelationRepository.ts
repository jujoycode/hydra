import { eq, or } from 'drizzle-orm'
import type { NodePgDatabase } from 'drizzle-orm/node-postgres'
import * as schema from '../../schema/drizzle/schema'
import type {
  CreateRelationData,
  IssueRelationRecord,
  IssueRelationRepository
} from '../interfaces/IssueRelationRepository'

const { issueRelations } = schema

export class DrizzleIssueRelationRepository implements IssueRelationRepository {
  constructor(private db: NodePgDatabase<typeof schema>) {}

  async create(data: CreateRelationData): Promise<IssueRelationRecord> {
    const rows = await this.db
      .insert(issueRelations)
      .values({
        relation_id: data.relationId,
        source_issue_id: data.sourceIssueId,
        target_issue_id: data.targetIssueId,
        relation_type: data.relationType,
        relation_created_at: new Date()
      })
      .returning()
    return rows[0] as IssueRelationRecord
  }

  async findByIssue(issueId: string): Promise<IssueRelationRecord[]> {
    const rows = await this.db
      .select()
      .from(issueRelations)
      .where(or(eq(issueRelations.source_issue_id, issueId), eq(issueRelations.target_issue_id, issueId)))
    return rows as IssueRelationRecord[]
  }

  async delete(relationId: string): Promise<boolean> {
    await this.db.delete(issueRelations).where(eq(issueRelations.relation_id, relationId))
    return true
  }
}
