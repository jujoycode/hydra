import { BaseValidation } from './BaseValidation'
import type { CoreDataBase } from '@database/CoreDataBase'

export class IssueValidation extends BaseValidation {
  constructor(hydraDB: CoreDataBase) {
    super(hydraDB)
  }

  /**
   * checkLimit
   * @param projectId
   * @desc 이슈 개수 제한 체크
   */
  public async checkLimit(projectId: string): Promise<void> {
    await this.validate({
      type: this.validationType.LIMIT,
      model: 'issues',
      where: {
        project_id: projectId
      }
    })
  }
}
