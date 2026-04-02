import { CoreBaseHandler } from '@/base/CoreBaseHandler'
import { IpcChannel, type LinkLabelParams } from '@/interface/CoreInterface'

export class LinkLabelHandler extends CoreBaseHandler<IpcChannel.LABEL_LINK> {
  constructor() {
    super(IpcChannel.LABEL_LINK)
  }

  async handler(params: LinkLabelParams) {
    await this.repos.labels.linkToIssue(params.issueId, params.labelId)
    return { data: true, error: null }
  }
}
