import { randomUUID } from 'crypto'
import { CoreBaseHandler } from '@base/CoreBaseHandler'
import { IssueValidator } from '@util/validator'
import { IpcChannel, type CreateIssueParams, type issues } from '@interface/CoreInterface'

export class CreateIssueHandler extends CoreBaseHandler<IssueValidator> {
  constructor() {
    super(IpcChannel.ISSUE_CREATE, IssueValidator)
  }

  async handler(params: CreateIssueParams): Promise<issues> {
    this.logDebug(`CreateIssueHandler Params: ${JSON.stringify(params)}`)

    // 1. 이슈 생성 전 체크 (이슈 갯수 체크)
    await this.validator?.checkCreateIssue(params.projectId)

    // 2. 이슈 생성 (public.issues)
    return await this.getHydraDb().issues.create({
      data: {
        issue_id: randomUUID(),
        project_id: params.projectId,
        issue_title: params.issueTitle,
        issue_key: params.issueKey,
        issue_desc: params.issueDesc,
        issue_created_by: params.userId,
        issue_modified_by: params.userId,
        issue_created_at: new Date(),
        issue_updated_at: new Date()
      }
    })
  }
}
