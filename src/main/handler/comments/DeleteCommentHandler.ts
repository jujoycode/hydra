import { CoreBaseHandler } from '@/base/CoreBaseHandler'
import { type DeleteCommentParams, IpcChannel } from '@/interface/CoreInterface'

export class DeleteCommentHandler extends CoreBaseHandler<IpcChannel.COMMENT_DELETE> {
  constructor() {
    super(IpcChannel.COMMENT_DELETE)
  }

  async handler(params: DeleteCommentParams) {
    const result = await this.repos.comments.delete(params.commentId)
    return { data: result, error: null }
  }
}
