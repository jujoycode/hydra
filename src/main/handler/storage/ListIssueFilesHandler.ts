import { CoreBaseHandler } from '@/base/CoreBaseHandler'
import { IpcChannel, type ListIssueFilesParams } from '@/interface/CoreInterface'

export class ListIssueFilesHandler extends CoreBaseHandler<IpcChannel.STORAGE_LIST_ISSUE_FILES> {
  constructor() {
    super(IpcChannel.STORAGE_LIST_ISSUE_FILES)
  }

  async handler(params: ListIssueFilesParams) {
    const files = await this.repos.files.findByIssue(params.issueId)
    return { data: files, error: null }
  }
}
