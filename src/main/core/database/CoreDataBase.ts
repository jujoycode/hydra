import { CoreBase } from '@base/CoreBase'
import { PrismaLib } from '@lib/PrismaLib'
import { CoreInterface, PrismaClient } from '@interface/CoreInterface'

export class CoreDataBase extends CoreBase implements CoreInterface {
  private static instance: CoreDataBase
  private prismaClient: PrismaClient

  private constructor() {
    super()
    this.logInfo('Initializing database instance')
    this.prismaClient = new PrismaLib().getPrismaClient()
  }

  public static getInstance(): CoreDataBase {
    if (!CoreDataBase.instance) {
      CoreDataBase.instance = new CoreDataBase()
    }

    return CoreDataBase.instance
  }

  public getPrismaClient(): PrismaClient {
    return this.prismaClient
  }

  public static async checkCreateProjects(userId: string, projectName: string): Promise<void> {
    await CoreDataBase.checkProjectName(projectName)
    await CoreDataBase.checkProjectLimit(userId)
  }

  public static async checkUpdateProjects(projectName: string): Promise<void> {
    await CoreDataBase.checkProjectName(projectName)
  }

  public static async checkCreateIssues(projectId: string) {
    await CoreDataBase.checkIssueLimit(projectId)
  }

  /**
   * checkProjectName
   * @desc 프로젝트 이름 중복 체크
   * @param projectName 프로젝트 이름
   * @returns 프로젝트 이름이 중복되는 경우 true, 아닌 경우 false
   */
  private static async checkProjectName(projectName: string): Promise<void> {
    const prismaClient = CoreDataBase.getInstance().getPrismaClient()

    const project = await prismaClient.projects.findFirst({
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
    const prismaClient = CoreDataBase.getInstance().getPrismaClient()

    const project = await prismaClient.users_projects_link.findMany({
      where: {
        user_id: userId
      }
    })

    if(project.length > 3) {
        throw new Error('Project limit exceeded')
    }
  }

  private static async checkIssueLimit(projectId: string) {
    const prismaClient = CoreDataBase.getInstance().getPrismaClient()
    
    const issue = await prismaClient.issues.findMany({
      where: {
        project_id: projectId
      }
    })

    if(issue.length > 100) {
        throw new Error('Issue limit exceeded')
    }
  }
}
