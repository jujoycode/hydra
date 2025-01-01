import type { PrismaClient } from '@prisma/client'
import type { NewIssueParams, issues } from '@interface/CoreInterface'
import { CoreBaseHandler } from '@base/CoreBaseHandler'
import { PrismaLib } from '@lib/PrismaLib'
import { randomUUID } from 'crypto'
import { ProjectBaseHandler } from './ProjectBaseHandler'

export class NewIssueHandler extends CoreBaseHandler {
  private prismaClient: PrismaClient

  constructor() {
    super('newIssueHandler')
    this.prismaClient = new PrismaLib().getPrismaClient()
  }

  async handler(params: NewIssueParams): Promise<issues> {
    console.debug(`NewProjectHandler Params: ${JSON.stringify(params)}`)

    // 1. 이슈 생성 전 체크 (이슈 갯수 체크)
    await ProjectBaseHandler.checkCreateIssues(params.projectId)

    // 2. 이슈 생성 (public.issues)
    return await this.prismaClient.issues.create({
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

