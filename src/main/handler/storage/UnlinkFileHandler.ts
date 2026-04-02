import { CoreBaseHandler } from '@/base/CoreBaseHandler'
import { IpcChannel, type LinkFileParams } from '@/interface/CoreInterface'

export class UnlinkFileHandler extends CoreBaseHandler<IpcChannel.STORAGE_UNLINK_FILE> {
  constructor() {
    super(IpcChannel.STORAGE_UNLINK_FILE)
  }

  async handler(params: LinkFileParams) {
    await this.repos.files.unlinkFromIssue(params.issueId, params.fileId)
    return { data: true, error: null }
  }
}
