import { IpcChannel, type DeleteIssueParams } from '@interface/CoreInterface'
import { CoreBaseHandler } from '@base/CoreBaseHandler'

export class DeleteIssueHandler extends CoreBaseHandler {
  constructor() {
    super(IpcChannel.ISSUE_DELETE)
  }

  async handler(params: DeleteIssueParams): Promise<boolean> {
    this.logDebug(`DeleteIssueHandler Params: ${JSON.stringify(params)}`)

    const issue = await this.getHydraDb().issues.delete({
      where: {
        issue_id: params.issueId
      }
    })

    return issue ? true : false
  }
}
