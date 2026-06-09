import { desc, eq } from 'drizzle-orm'
import * as schema from '../../schema/drizzle/schema'
import type {
  CommentRecord,
  CommentRepository,
  CreateCommentData,
  UpdateCommentData
} from '../interfaces/CommentRepository'
import type { DrizzleDb } from './executor'
import { selectById } from './readAfterWrite'

const { comments } = schema

export class DrizzleCommentRepository implements CommentRepository {
  constructor(private db: DrizzleDb) {}

  async create(data: CreateCommentData): Promise<CommentRecord> {
    const now = new Date()
    await this.db.insert(comments).values({
      comment_id: data.commentId,
      issue_id: data.issueId,
      comment_content: data.commentContent,
      comment_created_by: data.createdBy,
      comment_created_at: now,
      comment_updated_at: now
    })
    return selectById<CommentRecord>(this.db, comments, comments.comment_id, data.commentId)
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
    await this.db
      .update(comments)
      .set({
        comment_content: data.commentContent,
        comment_updated_by: data.updatedBy,
        comment_updated_at: new Date()
      })
      .where(eq(comments.comment_id, commentId))
    return selectById<CommentRecord>(this.db, comments, comments.comment_id, commentId)
  }

  async delete(commentId: string): Promise<boolean> {
    await this.db.delete(comments).where(eq(comments.comment_id, commentId))
    return true
  }
}
