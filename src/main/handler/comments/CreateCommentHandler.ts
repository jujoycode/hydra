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
    return { data: comment, error: null }
  }
}
