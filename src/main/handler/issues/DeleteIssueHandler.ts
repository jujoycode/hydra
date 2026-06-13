import { CoreBaseHandler } from '@/base/CoreBaseHandler'
import { type DeleteIssueParams, IpcChannel } from '@/interface/CoreInterface'

export class DeleteIssueHandler extends CoreBaseHandler<IpcChannel.ISSUE_DELETE> {
  constructor() {
    super(IpcChannel.ISSUE_DELETE)
  }

  async handler(params: DeleteIssueParams) {
    const result = await this.repos.issues.delete(params.issueId)

    return { data: result, error: null }
  }
}
