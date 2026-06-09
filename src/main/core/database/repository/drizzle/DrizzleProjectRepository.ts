// Drizzle 기반 프로젝트 리포지토리 구현

import { and, eq, sql } from 'drizzle-orm'
import * as schema from '../../schema/drizzle/schema'
import type {
  CreateProjectData,
  ProjectRecord,
  ProjectRepository,
  UpdateProjectData
} from '../interfaces/ProjectRepository'
import type { RepoExecutor } from '../interfaces/RepoExecutor'
import type { DrizzleDb, DrizzleExecutor } from './executor'

const { projects, usersProjectsLink } = schema

export class DrizzleProjectRepository implements ProjectRepository {
  constructor(private db: DrizzleDb) {}

  async create(data: CreateProjectData, executor: RepoExecutor = this.db): Promise<ProjectRecord> {
    const ex = executor as DrizzleExecutor
    const rows = await ex
      .insert(projects)
      .values({
        project_id: data.projectId,
        project_name: data.projectName,
        project_key: data.projectKey,
        project_desc: data.projectDesc ?? null,
        project_created_by: data.createdBy,
        project_start_date: data.startDate ?? null,
        project_end_date: data.endDate ?? null
      })
      .returning()
    return rows[0] as ProjectRecord
  }

  async findAll(): Promise<ProjectRecord[]> {
    const rows = await this.db.select().from(projects)
    return rows as ProjectRecord[]
  }

  async findById(projectId: string): Promise<ProjectRecord | null> {
    const rows = await this.db.select().from(projects).where(eq(projects.project_id, projectId)).limit(1)
    return (rows[0] as ProjectRecord) ?? null
  }

  async findByUserId(userId: string): Promise<ProjectRecord[]> {
    const rows = await this.db
      .select({
        project_id: projects.project_id,
        project_name: projects.project_name,
        project_key: projects.project_key,
        project_desc: projects.project_desc,
        project_created_by: projects.project_created_by,
        project_modified_by: projects.project_modified_by,
        project_start_date: projects.project_start_date,
        project_end_date: projects.project_end_date
      })
      .from(usersProjectsLink)
      .innerJoin(projects, eq(usersProjectsLink.project_id, projects.project_id))
      .where(eq(usersProjectsLink.user_id, userId))
    return rows as ProjectRecord[]
  }

  async update(projectId: string, data: UpdateProjectData): Promise<ProjectRecord> {
    const values: Record<string, unknown> = {}
    if (data.projectName !== undefined) values.project_name = data.projectName
    if (data.projectDesc !== undefined) values.project_desc = data.projectDesc
    if (data.modifiedBy !== undefined) values.project_modified_by = data.modifiedBy
    if (data.startDate !== undefined) values.project_start_date = data.startDate
    if (data.endDate !== undefined) values.project_end_date = data.endDate

    const rows = await this.db.update(projects).set(values).where(eq(projects.project_id, projectId)).returning()
    return rows[0] as ProjectRecord
  }

  async delete(projectId: string): Promise<boolean> {
    await this.db.delete(projects).where(eq(projects.project_id, projectId))
    return true
  }

  async linkUser(linkId: string, userId: string, projectId: string, executor: RepoExecutor = this.db): Promise<void> {
    const ex = executor as DrizzleExecutor
    await ex.insert(usersProjectsLink).values({
      user_project_link_id: linkId,
      user_id: userId,
      project_id: projectId
    })
  }

  async unlinkUser(userId: string, projectId: string): Promise<void> {
    await this.db
      .delete(usersProjectsLink)
      .where(and(eq(usersProjectsLink.user_id, userId), eq(usersProjectsLink.project_id, projectId)))
  }

  async countByCreator(userId: string): Promise<number> {
    const rows = await this.db
      .select({ count: sql<number>`count(*)` })
      .from(projects)
      .where(eq(projects.project_created_by, userId))
    return Number(rows[0].count)
  }

  async countByName(name: string): Promise<number> {
    const rows = await this.db
      .select({ count: sql<number>`count(*)` })
      .from(projects)
      .where(eq(projects.project_name, name))
    return Number(rows[0].count)
  }

  async countByKey(key: string): Promise<number> {
    const rows = await this.db
      .select({ count: sql<number>`count(*)` })
      .from(projects)
      .where(eq(projects.project_key, key))
    return Number(rows[0].count)
  }
}
