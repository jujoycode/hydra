export interface CreateCommentData {
  commentId: string
  issueId: string
  commentContent: string
  createdBy: string
}

export interface UpdateCommentData {
  commentContent: string
  updatedBy: string
}

export interface CommentRecord {
  comment_id: string
  issue_id: string
  comment_content: string
  comment_created_by: string | null
  comment_updated_by: string | null
  comment_created_at: Date | null
  comment_updated_at: Date | null
}

export interface CommentRepository {
  create(data: CreateCommentData): Promise<CommentRecord>
  findByIssue(issueId: string): Promise<CommentRecord[]>
  update(commentId: string, data: UpdateCommentData): Promise<CommentRecord>
  delete(commentId: string): Promise<boolean>
}
