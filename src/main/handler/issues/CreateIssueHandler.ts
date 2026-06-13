import { CoreBaseHandler } from '@/base/CoreBaseHandler'
import { type CreateIssueParams, IpcChannel } from '@/interface/CoreInterface'
import { CoreUtil } from '@/util/CoreUtil'
import { IssueValidator } from '@/util/validator'

export class CreateIssueHandler extends CoreBaseHandler<IpcChannel.ISSUE_CREATE, IssueValidator> {
  constructor() {
    super(IpcChannel.ISSUE_CREATE, IssueValidator)
  }

  async handler(params: CreateIssueParams) {
    // 1. 이슈 생성 전 체크 (이슈 갯수 체크)
    await this.validator?.checkCreateIssue(params.projectId)

    // 2. 이슈 생성 (public.issues)
    const issue = await this.repos.issues.create({
      issueId: CoreUtil.getUuid(),
      projectId: params.projectId,
      issueTitle: params.issueTitle,
      issueKey: params.issueKey,
      issueDesc: params.issueDesc,
      issueStatus: 'open',
      issuePriority: params.issuePriority,
      issueCategory: params.issueCategory,
      createdBy: params.userId,
      assignedTo: params.assignedTo
    })

    return { data: issue, error: null }
  }
}
