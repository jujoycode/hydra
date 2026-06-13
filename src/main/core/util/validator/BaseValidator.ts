import type { RepositoryContainer } from '@/database/RepositoryContainer'

export abstract class BaseValidator {
  protected readonly repos: RepositoryContainer

  constructor(repos: RepositoryContainer) {
    this.repos = repos
  }
}
