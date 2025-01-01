import type { PrismaClient } from '@prisma/client'
import type { NewProjectParams, projects } from '@interface/CoreInterface'
import { CoreBaseHandler } from '@base/CoreBaseHandler'
import { PrismaLib } from '@lib/PrismaLib'
import { randomUUID } from 'crypto'

export class NewProjectHandler extends CoreBaseHandler {
  private prismaClient: PrismaClient

  constructor() {
    super('newProjectHandler')
    this.prismaClient = new PrismaLib().getPrismaClient()
  }

  async handler(params: NewProjectParams): Promise<projects> {
    console.debug(`NewProjectHandler Params: ${JSON.stringify(params)}`)

    return await this.prismaClient.projects.create({
      data: {
        project_id: randomUUID(),
        project_name: params.projectName,
        project_desc: params.projectDescription,
        project_created_by: params.userId,
        project_modified_by: params.userId,
        project_start_date: new Date(),
        project_end_date: new Date()
      }
    })
  }
}
