import { CoreBaseHandler } from '@/base/CoreBaseHandler'
import { IpcChannel, type ListCommentsParams } from '@/interface/CoreInterface'

export class ListCommentsHandler extends CoreBaseHandler<IpcChannel.COMMENT_LIST> {
  constructor() {
    super(IpcChannel.COMMENT_LIST)
  }

  async handler(params: ListCommentsParams) {
    const comments = await this.repos.comments.findByIssue(params.issueId)
    return { data: comments, error: null }
  }
}
