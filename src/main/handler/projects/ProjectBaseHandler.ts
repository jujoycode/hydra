import type { PrismaClient } from '@prisma/client'
import { PrismaLib } from '@lib/PrismaLib'

export class ProjectBaseHandler {
  private static prismaClient: PrismaClient

  constructor() {
    ProjectBaseHandler.prismaClient = new PrismaLib().getPrismaClient()
  }

  public static async checkCreateProjects(userId: string, projectName: string): Promise<void> {
    await ProjectBaseHandler.checkProjectName(projectName)
    await ProjectBaseHandler.checkProjectLimit(userId)
  }

  public static async checkUpdateProjects(projectName: string): Promise<void> {
    await ProjectBaseHandler.checkProjectName(projectName)
  }

  public static async checkCreateIssues(projectId: string) {
    await ProjectBaseHandler.checkIssueLimit(projectId)
  }

  /**
   * checkProjectName
   * @desc 프로젝트 이름 중복 체크
   * @param projectName 프로젝트 이름
   * @returns 프로젝트 이름이 중복되는 경우 true, 아닌 경우 false
   */
  private static async checkProjectName(projectName: string): Promise<void> {
    const project = await ProjectBaseHandler.prismaClient.projects.findFirst({
      where: {
        project_name: projectName
      }
    })

    if(project) {
        throw new Error('Project name already exists')
    }
  }

  /**
   * checkProjectLimit
   * @desc 사용자가 소유한 프로젝트 수 체크
   * @param userId 사용자 ID
   * @returns 프로젝트 수가 3개 이상인 경우 false, 아닌 경우 true
   */
  private static async checkProjectLimit(userId: string): Promise<void> {
    const project = await ProjectBaseHandler.prismaClient.users_projects_link.findMany({
      where: {
        user_id: userId
      }
    })

    if(project.length > 3) {
        throw new Error('Project limit exceeded')
    }
  }

  private static async checkIssueLimit(projectId: string) {
    const issue = await ProjectBaseHandler.prismaClient.issues.findMany({
      where: {
        project_id: projectId
      }
    })

    if(issue.length > 100) {
        throw new Error('Issue limit exceeded')
    }
  }
}

