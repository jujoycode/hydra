import { IpcChannel, type CreateIssueParams, type issues } from '@interface/CoreInterface'
import { CoreBaseHandler } from '@base/CoreBaseHandler'
import { randomUUID } from 'crypto'
import { CoreDataBase } from '@database/CoreDataBase'

export class CreateIssueHandler extends CoreBaseHandler {

  constructor() {
    super(IpcChannel.ISSUE_CREATE)
  }

  async handler(params: CreateIssueParams): Promise<issues> {
    this.logDebug(`CreateIssueHandler Params: ${JSON.stringify(params)}`)

    // 1. 이슈 생성 전 체크 (이슈 갯수 체크)
    await CoreDataBase.checkCreateIssues(params.projectId)

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

