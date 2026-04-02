import { CoreBaseHandler } from '@/base/CoreBaseHandler'
import { IpcChannel, type LinkLabelParams } from '@/interface/CoreInterface'

export class UnlinkLabelHandler extends CoreBaseHandler<IpcChannel.LABEL_UNLINK> {
  constructor() {
    super(IpcChannel.LABEL_UNLINK)
  }

  async handler(params: LinkLabelParams) {
    await this.repos.labels.unlinkFromIssue(params.issueId, params.labelId)
    return { data: true, error: null }
  }
}
