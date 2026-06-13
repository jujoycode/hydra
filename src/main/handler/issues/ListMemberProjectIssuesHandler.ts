import { CoreBaseHandler } from '@/base/CoreBaseHandler'
import { IpcChannel, type ListMemberProjectIssuesParams } from '@/interface/CoreInterface'

export class ListMemberProjectIssuesHandler extends CoreBaseHandler<IpcChannel.ISSUE_LIST_MEMBER_PROJECTS> {
  constructor() {
    super(IpcChannel.ISSUE_LIST_MEMBER_PROJECTS)
  }

  async handler(params: ListMemberProjectIssuesParams) {
    const issues = await this.repos.issues.findByUserProjects(params.userId)
    return { data: issues, error: null }
  }
}
