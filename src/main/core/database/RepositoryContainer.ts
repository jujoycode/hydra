// 리포지토리 컨테이너 - 싱글톤 패턴으로 DB 어댑터와 리포지토리 인스턴스 관리

import type { DatabaseAdapter } from './adapter/DatabaseAdapter'
import type { CommentRepository } from './repository/interfaces/CommentRepository'
import type { FileRepository } from './repository/interfaces/FileRepository'
import type { IssueRepository } from './repository/interfaces/IssueRepository'
import type { ProjectRepository } from './repository/interfaces/ProjectRepository'
import type { UserRepository } from './repository/interfaces/UserRepository'

export class RepositoryContainer {
  private static instance: RepositoryContainer | null = null
  private adapter: DatabaseAdapter | null = null
  private _users: UserRepository | null = null
  private _projects: ProjectRepository | null = null
  private _issues: IssueRepository | null = null
  private _files: FileRepository | null = null
  private _comments: CommentRepository | null = null

  private constructor() {}

  static getInstance(): RepositoryContainer {
    if (!RepositoryContainer.instance) {
      RepositoryContainer.instance = new RepositoryContainer()
    }
    return RepositoryContainer.instance
  }

  initialize(
    adapter: DatabaseAdapter,
    users: UserRepository,
    projects: ProjectRepository,
    issues: IssueRepository,
    files: FileRepository,
    comments: CommentRepository
  ): void {
    this.adapter = adapter
    this._users = users
    this._projects = projects
    this._issues = issues
    this._files = files
    this._comments = comments
  }

  async teardown(): Promise<void> {
    if (this.adapter?.isConnected()) {
      await this.adapter.disconnect()
    }
    this.adapter = null
    this._users = null
    this._projects = null
    this._issues = null
    this._files = null
    this._comments = null
  }

  get db(): DatabaseAdapter {
    if (!this.adapter) {
      throw new Error('RepositoryContainer is not initialized. Call initialize() first.')
    }
    return this.adapter
  }

  get users(): UserRepository {
    if (!this._users) {
      throw new Error('RepositoryContainer is not initialized. Call initialize() first.')
    }
    return this._users
  }

  get projects(): ProjectRepository {
    if (!this._projects) {
      throw new Error('RepositoryContainer is not initialized. Call initialize() first.')
    }
    return this._projects
  }

  get issues(): IssueRepository {
    if (!this._issues) {
      throw new Error('RepositoryContainer is not initialized. Call initialize() first.')
    }
    return this._issues
  }

  get files(): FileRepository {
    if (!this._files) {
      throw new Error('RepositoryContainer is not initialized. Call initialize() first.')
    }
    return this._files
  }

  get comments(): CommentRepository {
    if (!this._comments) {
      throw new Error('RepositoryContainer is not initialized. Call initialize() first.')
    }
    return this._comments
  }

  get isInitialized(): boolean {
    return this.adapter !== null
  }
}
