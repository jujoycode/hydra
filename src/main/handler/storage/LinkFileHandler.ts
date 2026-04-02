import { CoreBaseHandler } from '@/base/CoreBaseHandler'
import { IpcChannel, type LinkFileParams } from '@/interface/CoreInterface'

export class LinkFileHandler extends CoreBaseHandler<IpcChannel.STORAGE_LINK_FILE> {
  constructor() {
    super(IpcChannel.STORAGE_LINK_FILE)
  }

  async handler(params: LinkFileParams) {
    await this.repos.files.linkToIssue(params.issueId, params.fileId)
    return { data: true, error: null }
  }
}
