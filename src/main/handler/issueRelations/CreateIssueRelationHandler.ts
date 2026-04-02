import { CoreBaseHandler } from '@/base/CoreBaseHandler'
import { type CreateIssueRelationParams, IpcChannel } from '@/interface/CoreInterface'
import { CoreUtil } from '@/util/CoreUtil'

export class CreateIssueRelationHandler extends CoreBaseHandler<IpcChannel.ISSUE_RELATION_CREATE> {
  constructor() {
    super(IpcChannel.ISSUE_RELATION_CREATE)
  }

  async handler(params: CreateIssueRelationParams) {
    const relation = await this.repos.issueRelations.create({
      relationId: CoreUtil.getUuid(),
      sourceIssueId: params.sourceIssueId,
      targetIssueId: params.targetIssueId,
      relationType: params.relationType
    })
    return { data: relation, error: null }
  }
}
