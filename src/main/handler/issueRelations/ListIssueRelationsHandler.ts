import { CoreBaseHandler } from '@/base/CoreBaseHandler'
import { IpcChannel, type ListIssueRelationsParams } from '@/interface/CoreInterface'

export class ListIssueRelationsHandler extends CoreBaseHandler<IpcChannel.ISSUE_RELATION_LIST> {
  constructor() {
    super(IpcChannel.ISSUE_RELATION_LIST)
  }

  async handler(params: ListIssueRelationsParams) {
    const relations = await this.repos.issueRelations.findByIssue(params.issueId)
    return { data: relations, error: null }
  }
}
