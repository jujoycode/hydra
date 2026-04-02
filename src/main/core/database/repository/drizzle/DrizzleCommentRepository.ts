import { desc, eq } from 'drizzle-orm'
import type { NodePgDatabase } from 'drizzle-orm/node-postgres'
import * as schema from '../../schema/drizzle/schema'
import type {
  CommentRecord,
  CommentRepository,
  CreateCommentData,
  UpdateCommentData
} from '../interfaces/CommentRepository'

const { comments } = schema

export class DrizzleCommentRepository implements CommentRepository {
  constructor(private db: NodePgDatabase<typeof schema>) {}

  async create(data: CreateCommentData): Promise<CommentRecord> {
    const now = new Date()
    const rows = await this.db
      .insert(comments)
      .values({
        comment_id: data.commentId,
        issue_id: data.issueId,
        comment_content: data.commentContent,
        comment_created_by: data.createdBy,
        comment_created_at: now,
        comment_updated_at: now
      })
      .returning()
    return rows[0] as CommentRecord
  }

  async findByIssue(issueId: string): Promise<CommentRecord[]> {
    const rows = await this.db
      .select()
      .from(comments)
      .where(eq(comments.issue_id, issueId))
      .orderBy(desc(comments.comment_created_at))
    return rows as CommentRecord[]
  }

  async update(commentId: string, data: UpdateCommentData): Promise<CommentRecord> {
    const rows = await this.db
      .update(comments)
      .set({
        comment_content: data.commentContent,
        comment_updated_by: data.updatedBy,
        comment_updated_at: new Date()
      })
      .where(eq(comments.comment_id, commentId))
      .returning()
    return rows[0] as CommentRecord
  }

  async delete(commentId: string): Promise<boolean> {
    await this.db.delete(comments).where(eq(comments.comment_id, commentId))
    return true
  }
}
