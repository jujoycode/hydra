import { describe, expect, it, vi } from 'vitest'
import type { RepositoryContainer } from '@/database/RepositoryContainer'
import { ValidationError } from '@/error/ValidationError'
import { ProjectValidator } from './ProjectValidator'

function createMockRepos(
  overrides: Partial<{
    countByName: (name: string) => Promise<number>
    countByKey: (key: string) => Promise<number>
    countByCreator: (userId: string) => Promise<number>
  }> = {}
): RepositoryContainer {
  return {
    projects: {
      countByName: overrides.countByName ?? vi.fn().mockResolvedValue(0),
      countByKey: overrides.countByKey ?? vi.fn().mockResolvedValue(0),
      countByCreator: overrides.countByCreator ?? vi.fn().mockResolvedValue(0)
    }
  } as unknown as RepositoryContainer
}

describe('ProjectValidator', () => {
  describe('checkCreateProject', () => {
    it('should pass when all checks are valid', async () => {
      const repos = createMockRepos()
      const validator = new ProjectValidator(repos)

      await expect(validator.checkCreateProject('user-1', 'My Project', 'MP')).resolves.toBeUndefined()
    })

    it('should throw on duplicate project name', async () => {
      const repos = createMockRepos({ countByName: vi.fn().mockResolvedValue(1) })
      const validator = new ProjectValidator(repos)

      await expect(validator.checkCreateProject('user-1', 'Existing', 'EX')).rejects.toThrow(ValidationError)
    })

    it('should throw on duplicate project key', async () => {
      const repos = createMockRepos({ countByKey: vi.fn().mockResolvedValue(1) })
      const validator = new ProjectValidator(repos)

      await expect(validator.checkCreateProject('user-1', 'New', 'EXISTING')).rejects.toThrow(ValidationError)
    })

    it('should throw when project limit (3) exceeded', async () => {
      const repos = createMockRepos({ countByCreator: vi.fn().mockResolvedValue(3) })
      const validator = new ProjectValidator(repos)

      await expect(validator.checkCreateProject('user-1', 'New', 'NW')).rejects.toThrow(ValidationError)
    })

    it('should pass when user has fewer than 3 projects', async () => {
      const repos = createMockRepos({ countByCreator: vi.fn().mockResolvedValue(2) })
      const validator = new ProjectValidator(repos)

      await expect(validator.checkCreateProject('user-1', 'New', 'NW')).resolves.toBeUndefined()
    })
  })

  describe('checkUpdateProject', () => {
    it('should pass when name is unique', async () => {
      const repos = createMockRepos()
      const validator = new ProjectValidator(repos)

      await expect(validator.checkUpdateProject('New Name')).resolves.toBeUndefined()
    })

    it('should throw on duplicate name', async () => {
      const repos = createMockRepos({ countByName: vi.fn().mockResolvedValue(1) })
      const validator = new ProjectValidator(repos)

      await expect(validator.checkUpdateProject('Existing')).rejects.toThrow(ValidationError)
    })

    it('should check key uniqueness when key is provided', async () => {
      const repos = createMockRepos({ countByKey: vi.fn().mockResolvedValue(1) })
      const validator = new ProjectValidator(repos)

      await expect(validator.checkUpdateProject('New Name', 'EXISTING')).rejects.toThrow(ValidationError)
    })

    it('should skip key check when key is not provided', async () => {
      const countByKey = vi.fn().mockResolvedValue(1)
      const repos = createMockRepos({ countByKey })
      const validator = new ProjectValidator(repos)

      await expect(validator.checkUpdateProject('New Name')).resolves.toBeUndefined()
      expect(countByKey).not.toHaveBeenCalled()
    })
  })
})
