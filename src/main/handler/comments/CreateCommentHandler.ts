import { CoreBaseHandler } from '@/base/CoreBaseHandler'
import { type CreateCommentParams, IpcChannel } from '@/interface/CoreInterface'
import { CoreUtil } from '@/util/CoreUtil'

export class CreateCommentHandler extends CoreBaseHandler<IpcChannel.COMMENT_CREATE> {
  constructor() {
    super(IpcChannel.COMMENT_CREATE)
  }

  async handler(params: CreateCommentParams) {
    const comment = await this.repos.comments.create({
      commentId: CoreUtil.getUuid(),
      issueId: params.issueId,
      commentContent: params.commentContent,
      createdBy: params.userId
    })

    // 활동 로그 기록 — best-effort (실패해도 댓글 생성은 성공시킨다)
    try {
      await this.repos.activityLogs.create({
        activityId: CoreUtil.getUuid(),
        entityType: 'issue',
        entityId: params.issueId,
        action: 'comment_created',
        actorId: params.userId,
        metadata: JSON.stringify({ commentId: comment.comment_id })
      })
    } catch (error) {
      console.error('[activity] failed to record comment creation', error)
    }

    return { data: comment, error: null }
  }
}
