import type { PrismaClient } from '@prisma/client'
import type { DeleteProjectParams } from '@interface/CoreInterface'
import { CoreBaseHandler } from '@base/CoreBaseHandler'
import { PrismaLib } from '@lib/PrismaLib'

export class DeleteProjectHandler extends CoreBaseHandler {
  private prismaClient: PrismaClient

  constructor() {
    super('deleteProjectHandler')
    this.prismaClient = new PrismaLib().getPrismaClient()
  }

  async handler(params: DeleteProjectParams): Promise<boolean> {
    console.debug(`DeleteProjectHandler Params: ${JSON.stringify(params)}`)

    try {
      await this.prismaClient.$transaction([
        // 1. 사용자 프로젝트 관계 삭제 (public.users_projects_link)
        this.prismaClient.users_projects_link.delete({
          where: {
            // TODO: 무조건 PK로만 삭제가 가능한건지?
            user_project_link_id: params.projectId
          }
        }),
        
        // 2. 프로젝트 삭제 (public.projects)
        this.prismaClient.projects.delete({
          where: {
            project_id: params.projectId
          }
        })
      ])

      return true
    } catch (error) {
      console.error('DeleteProjectHandler Error:', error)
      return false
    }
  }
}

