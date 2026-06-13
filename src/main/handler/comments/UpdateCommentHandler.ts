import { CoreBaseHandler } from '@/base/CoreBaseHandler'
import { IpcChannel, type UpdateCommentParams } from '@/interface/CoreInterface'

export class UpdateCommentHandler extends CoreBaseHandler<IpcChannel.COMMENT_UPDATE> {
  constructor() {
    super(IpcChannel.COMMENT_UPDATE)
  }

  async handler(params: UpdateCommentParams) {
    const comment = await this.repos.comments.update(params.commentId, {
      commentContent: params.commentContent,
      updatedBy: params.userId
    })
    return { data: comment, error: null }
  }
}
