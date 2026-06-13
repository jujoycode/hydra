import { CoreBaseHandler } from '@/base/CoreBaseHandler'
import { IpcChannel, type UpdateIssueParams } from '@/interface/CoreInterface'

export class UpdateIssueHandler extends CoreBaseHandler<IpcChannel.ISSUE_UPDATE> {
  constructor() {
    super(IpcChannel.ISSUE_UPDATE)
  }

  async handler(params: UpdateIssueParams) {
    // 1. 이슈 업데이트 (public.issues)
    const issue = await this.repos.issues.update(params.issueId, {
      issueTitle: params.issueTitle,
      issueDesc: params.issueDesc,
      issueStatus: params.issueStatus,
      issuePriority: params.issuePriority,
      issueCategory: params.issueCategory,
      assignedTo: params.assignedTo,
      modifiedBy: params.userId
    })

    return { data: issue, error: null }
  }
}
