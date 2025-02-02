import { IpcChannel, type DeleteIssueParams } from '@interface/CoreInterface'
import { CoreBaseHandler } from '@base/CoreBaseHandler'

export class DeleteIssueHandler extends CoreBaseHandler<IpcChannel.ISSUE_DELETE> {
  constructor() {
    super(IpcChannel.ISSUE_DELETE)
  }

  async handler(params: DeleteIssueParams) {
    this.logDebug(`DeleteIssueHandler Params: ${JSON.stringify(params)}`)

    const issue = await this.getHydraDb().issues.delete({
      where: {
        issue_id: params.issueId
      }
    })

    return { data: issue ? true : false, error: null }
  }
}
