import { BaseValidator } from './BaseValidator'
import type { CoreDataBase } from '@database/CoreDataBase'

export class ProjectValidator extends BaseValidator {
  constructor(hydraDB: CoreDataBase) {
    super(hydraDB)
  }

  /**
   * checkCreateProject
   * @param userId
   * @param projectName
   * @desc 프로젝트 생성 검증
   */
  public async checkCreateProject(userId: string, projectName: string): Promise<void> {
    // *. 중복 명칭 체크
    await this.validate({
      type: this.validationType.DUPLICATE,
      model: 'projects',
      where: {
        project_name: projectName
      }
    })

    // *. 프로젝트 개수 제한 체크 (생성자 당 3개)
    await this.validate({
      type: this.validationType.LIMIT,
      model: 'users_projects_link',
      where: {
        user_id: userId
      },
      limit: 3
    })
  }

  /**
   * checkUpdateProject
   * @param projectName
   * @desc 프로젝트 수정 검증
   */
  public async checkUpdateProject(projectName: string): Promise<void> {
    await this.validate({
      type: this.validationType.DUPLICATE,
      model: 'projects',
      where: {
        project_name: projectName
      }
    })
  }
}
