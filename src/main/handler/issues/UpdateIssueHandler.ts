import { IpcChannel, type UpdateIssueParams } from '@/interface/CoreInterface'
import { CoreBaseHandler } from '@/base/CoreBaseHandler'

export class UpdateIssueHandler extends CoreBaseHandler<IpcChannel.ISSUE_UPDATE> {
  constructor() {
    super(IpcChannel.ISSUE_UPDATE)
  }

  async handler(params: UpdateIssueParams) {
    this.logDebug(`UpdateIssueHandler Params: ${JSON.stringify(params)}`)

    // 1. 이슈 업데이트 (public.issues)
    const issue = await this.getHydraDb().issues.update({
      where: {
        issue_id: params.issueId
      },
      data: {
        issue_title: params.issueTitle,
        issue_desc: params.issueDesc,
        issue_modified_by: params.userId
      }
    })

    return { data: issue, error: null }
  }
}
