import type { PrismaClient } from '@prisma/client'
import type { DeleteIssueParams } from '@interface/CoreInterface'
import { CoreBaseHandler } from '@base/CoreBaseHandler'
import { PrismaLib } from '@lib/PrismaLib'

export class DeleteIssueHandler extends CoreBaseHandler {
  private prismaClient: PrismaClient

  constructor() {
    super('deleteIssueHandler')
    this.prismaClient = new PrismaLib().getPrismaClient()
  }

  async handler(params: DeleteIssueParams): Promise<boolean> {
    console.debug(`DeleteIssueHandler Params: ${JSON.stringify(params)}`)

    const issue = await this.prismaClient.issues.delete({
      where: {
        issue_id: params.issueId
      }
    })

    return issue ? true : false
  }
}

