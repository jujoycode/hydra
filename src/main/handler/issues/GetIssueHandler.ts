import { CoreBaseHandler } from '@/base/CoreBaseHandler'
import { NotFoundError } from '@/error/NotFoundError'
import { type GetIssueParams, IpcChannel } from '@/interface/CoreInterface'

export class GetIssueHandler extends CoreBaseHandler<IpcChannel.ISSUE_GET> {
  constructor() {
    super(IpcChannel.ISSUE_GET)
  }

  async handler(params: GetIssueParams) {
    const issue = await this.repos.issues.findById(params.issueId)
    if (!issue) {
      throw new NotFoundError('Issue not found')
    }
    return { data: issue, error: null }
  }
}
