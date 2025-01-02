import { IpcChannel, type UpdateIssueParams, type issues } from '@interface/CoreInterface'
import { CoreBaseHandler } from '@base/CoreBaseHandler'

export class UpdateIssueHandler extends CoreBaseHandler {

  constructor() {
    super(IpcChannel.ISSUE_UPDATE)
  }

  async handler(params: UpdateIssueParams): Promise<issues> {
    this.logDebug(`UpdateIssueHandler Params: ${JSON.stringify(params)}`)

    // 1. 이슈 업데이트 (public.issues)
    return await this.getHydraDb().issues.update({
      where: {
        issue_id: params.issueId
      },
      data: {
        issue_title: params.issueTitle,
        issue_desc: params.issueDesc,
        issue_modified_by: params.userId
      }
    })
  }
}

