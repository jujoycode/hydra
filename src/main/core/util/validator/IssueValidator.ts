import { ValidationError } from '@/error/ValidationError'
import { BaseValidator } from './BaseValidator'

export class IssueValidator extends BaseValidator {
  /**
   * checkCreateIssue
   * @param projectId
   * @desc 이슈 개수 제한 체크
   */
  public async checkCreateIssue(projectId: string): Promise<void> {
    const count = await this.repos.issues.countByProject(projectId)
    if (count >= 100) {
      throw new ValidationError('Issue limit exceeded', { projectId, limit: 100 })
    }
  }
}
