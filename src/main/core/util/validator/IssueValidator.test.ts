import { describe, expect, it, vi } from 'vitest'
import type { RepositoryContainer } from '@/database/RepositoryContainer'
import { ValidationError } from '@/error/ValidationError'
import { IssueValidator } from './IssueValidator'

function createMockRepos(
  overrides: Partial<{
    countByProject: (projectId: string) => Promise<number>
  }> = {}
): RepositoryContainer {
  return {
    issues: {
      countByProject: overrides.countByProject ?? vi.fn().mockResolvedValue(0)
    }
  } as unknown as RepositoryContainer
}

describe('IssueValidator', () => {
  describe('checkCreateIssue', () => {
    it('should pass when issue count is below limit', async () => {
      const repos = createMockRepos()
      const validator = new IssueValidator(repos)
      await expect(validator.checkCreateIssue('project-1')).resolves.toBeUndefined()
    })

    it('should pass when issue count is 99', async () => {
      const repos = createMockRepos({ countByProject: vi.fn().mockResolvedValue(99) })
      const validator = new IssueValidator(repos)
      await expect(validator.checkCreateIssue('project-1')).resolves.toBeUndefined()
    })

    it('should throw when issue count reaches 100', async () => {
      const repos = createMockRepos({ countByProject: vi.fn().mockResolvedValue(100) })
      const validator = new IssueValidator(repos)
      await expect(validator.checkCreateIssue('project-1')).rejects.toThrow(ValidationError)
    })

    it('should throw when issue count exceeds 100', async () => {
      const repos = createMockRepos({ countByProject: vi.fn().mockResolvedValue(150) })
      const validator = new IssueValidator(repos)
      await expect(validator.checkCreateIssue('project-1')).rejects.toThrow(ValidationError)
    })

    it('should include projectId and limit in error data', async () => {
      const repos = createMockRepos({ countByProject: vi.fn().mockResolvedValue(100) })
      const validator = new IssueValidator(repos)
      try {
        await validator.checkCreateIssue('project-1')
        expect.unreachable('should have thrown')
      } catch (error) {
        expect(error).toBeInstanceOf(ValidationError)
        expect((error as any).data).toEqual({ projectId: 'project-1', limit: 100 })
      }
    })
  })
})
