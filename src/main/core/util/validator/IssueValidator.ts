import { BaseValidator } from './BaseValidator'
import type { CoreDataBase } from '@database/CoreDataBase'

export class IssueValidator extends BaseValidator {
  constructor(hydraDB: CoreDataBase) {
    super(hydraDB)
  }

  /**
   * checkCreateIssue
   * @param projectId
   * @desc 이슈 개수 제한 체크
   */
  public async checkCreateIssue(projectId: string): Promise<void> {
    await this.validate({
      type: this.validationType.LIMIT,
      model: 'issues',
      where: {
        project_id: projectId
      },
      limit: 100
    })
  }
}
