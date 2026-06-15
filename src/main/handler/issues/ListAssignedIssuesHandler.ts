import { CoreBaseHandler } from '@/base/CoreBaseHandler'
import { IpcChannel, type ListAssignedIssuesParams } from '@/interface/CoreInterface'

export class ListAssignedIssuesHandler extends CoreBaseHandler<IpcChannel.ISSUE_LIST_ASSIGNED> {
  constructor() {
    super(IpcChannel.ISSUE_LIST_ASSIGNED)
  }

  async handler(params: ListAssignedIssuesParams) {
    const issues = await this.repos.issues.findByAssignee(params.userId)
    return { data: issues, error: null }
  }
}
