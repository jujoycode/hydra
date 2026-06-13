import type { CommentRecord } from '../../database/repository/interfaces/CommentRepository'

export type Comment = CommentRecord

export interface CreateCommentParams {
  issueId: string
  commentContent: string
  userId: string
}

export interface UpdateCommentParams {
  commentId: string
  commentContent: string
  userId: string
}

export interface DeleteCommentParams {
  commentId: string
}

export interface ListCommentsParams {
  issueId: string
}
