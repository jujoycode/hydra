import type { PrismaClient } from '@prisma/client'
import type { UpdateIssueParams, issues } from '@interface/CoreInterface'
import { CoreBaseHandler } from '@base/CoreBaseHandler'
import { PrismaLib } from '@lib/PrismaLib'

export class UpdateIssueHandler extends CoreBaseHandler {
  private prismaClient: PrismaClient

  constructor() {
    super('updateIssueHandler')
    this.prismaClient = new PrismaLib().getPrismaClient()
  }

  async handler(params: UpdateIssueParams): Promise<issues> {
    console.debug(`UpdateIssueHandler Params: ${JSON.stringify(params)}`)


    // 1. 이슈 업데이트 (public.issues)
    return await this.prismaClient.issues.update({
      where: {
        issue_id: params.issueId
      },
      data: {
        issue_title: params.issueTitle,
        issue_desc: params.issueDesc,
        issue_modified_by: params.userId
      }
    })
  }
}

