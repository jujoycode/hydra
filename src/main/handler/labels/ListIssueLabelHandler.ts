import { CoreBaseHandler } from '@/base/CoreBaseHandler'
import { IpcChannel, type ListIssueLabelParams } from '@/interface/CoreInterface'

export class ListIssueLabelHandler extends CoreBaseHandler<IpcChannel.LABEL_LIST_BY_ISSUE> {
  constructor() {
    super(IpcChannel.LABEL_LIST_BY_ISSUE)
  }

  async handler(params: ListIssueLabelParams) {
    const labels = await this.repos.labels.findByIssue(params.issueId)
    return { data: labels, error: null }
  }
}
