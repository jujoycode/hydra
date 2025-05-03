import { ValidationError } from '@/error/ValidationError'
import { BaseValidator } from './BaseValidator'
import type { CoreDataBase } from '@/database/CoreDataBase'

export class ProjectValidator extends BaseValidator {
  constructor(hydraDB: CoreDataBase) {
    super(hydraDB)
  }

  /**
   * checkCreateProject
   * @param userId
   * @param projectName
   * @param projectKey
   * @desc 프로젝트 생성 검증
   */
  public async checkCreateProject(userId: string, projectName: string, projectKey: string): Promise<void> {
    try {
      // 1. 중복 명칭 체크
      await this.validate({
        type: this.validationType.DUPLICATE,
        model: 'projects',
        where: {
          project_name: projectName
        }
      })

      // 2. 프로젝트 키 중복 체크
      await this.validate({
        type: this.validationType.DUPLICATE,
        model: 'projects',
        where: {
          project_key: projectKey
        }
      })

      // 3. 프로젝트 개수 제한 체크 (생성자 당 3개)
      await this.validate({
        type: this.validationType.LIMIT,
        model: 'users_projects_link',
        where: {
          user_id: userId
        },
        limit: 3
      })
    } catch (error: unknown) {
      if (error instanceof ValidationError) {
        throw error
      } else {
        throw new ValidationError('Validation failed', null)
      }
    }
  }

  /**
   * checkUpdateProject
   * @param projectName
   * @param projectKey
   * @desc 프로젝트 수정 검증
   */
  public async checkUpdateProject(projectName: string, projectKey?: string): Promise<void> {
    // 1. 프로젝트 명 중복 체크
    await this.validate({
      type: this.validationType.DUPLICATE,
      model: 'projects',
      where: {
        project_name: projectName
      }
    })

    // 2. 프로젝트 키 중복 체크 (만약 제공된 경우)
    if (projectKey) {
      await this.validate({
        type: this.validationType.DUPLICATE,
        model: 'projects',
        where: {
          project_key: projectKey
        }
      })
    }
  }
}
