import { CoreBaseHandler } from '@/base/CoreBaseHandler'
import { IpcChannel, type ListIssueParams } from '@/interface/CoreInterface'

export class ListIssueHandler extends CoreBaseHandler<IpcChannel.ISSUE_LIST> {
  constructor() {
    super(IpcChannel.ISSUE_LIST)
  }

  async handler(params: ListIssueParams) {
    const issues = await this.repos.issues.findByProject(params.projectId)
    return { data: issues, error: null }
  }
}
