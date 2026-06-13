import { ValidationError } from '@/error/ValidationError'
import { BaseValidator } from './BaseValidator'

export class ProjectValidator extends BaseValidator {
  /**
   * checkCreateProject
   * @param userId
   * @param projectName
   * @param projectKey
   * @desc 프로젝트 생성 검증
   */
  public async checkCreateProject(userId: string, projectName: string, projectKey: string): Promise<void> {
    // 1. 중복 명칭 체크
    const nameCount = await this.repos.projects.countByName(projectName)
    if (nameCount > 0) {
      throw new ValidationError('Duplicate project name', { projectName })
    }

    // 2. 프로젝트 키 중복 체크
    const keyCount = await this.repos.projects.countByKey(projectKey)
    if (keyCount > 0) {
      throw new ValidationError('Duplicate project key', { projectKey })
    }

    // 3. 프로젝트 개수 제한 체크 (생성자 당 3개)
    const projectCount = await this.repos.projects.countByCreator(userId)
    if (projectCount >= 3) {
      throw new ValidationError('Project limit exceeded', { userId, limit: 3 })
    }
  }

  /**
   * checkUpdateProject
   * @param projectName
   * @param projectKey
   * @desc 프로젝트 수정 검증
   */
  public async checkUpdateProject(projectName: string, projectKey?: string): Promise<void> {
    const nameCount = await this.repos.projects.countByName(projectName)
    if (nameCount > 0) {
      throw new ValidationError('Duplicate project name', { projectName })
    }

    if (projectKey) {
      const keyCount = await this.repos.projects.countByKey(projectKey)
      if (keyCount > 0) {
        throw new ValidationError('Duplicate project key', { projectKey })
      }
    }
  }
}
