import { CoreBaseHandler } from '@/base/CoreBaseHandler'
import { ErrorCode, type GetIssueParams, IpcChannel } from '@/interface/CoreInterface'

export class GetIssueHandler extends CoreBaseHandler<IpcChannel.ISSUE_GET> {
  constructor() {
    super(IpcChannel.ISSUE_GET)
  }

  async handler(params: GetIssueParams) {
    const issue = await this.repos.issues.findById(params.issueId)
    if (!issue) {
      return { data: null, error: { code: ErrorCode.NOT_FOUND_ERROR, message: 'Issue not found', data: null } }
    }
    return { data: issue, error: null }
  }
}
