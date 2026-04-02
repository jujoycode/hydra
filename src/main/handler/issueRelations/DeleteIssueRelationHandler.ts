import { CoreBaseHandler } from '@/base/CoreBaseHandler'
import { type DeleteIssueRelationParams, IpcChannel } from '@/interface/CoreInterface'

export class DeleteIssueRelationHandler extends CoreBaseHandler<IpcChannel.ISSUE_RELATION_DELETE> {
  constructor() {
    super(IpcChannel.ISSUE_RELATION_DELETE)
  }

  async handler(params: DeleteIssueRelationParams) {
    const result = await this.repos.issueRelations.delete(params.relationId)
    return { data: result, error: null }
  }
}
