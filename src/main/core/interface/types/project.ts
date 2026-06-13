import type { ProjectRecord } from '../../database/repository/interfaces/ProjectRepository'

export type Project = ProjectRecord

export interface CreateProjectParams {
  userId: string
  projectName: string
  projectKey: string
  projectDesc?: string
}

export interface DeleteProjectParams {
  projectId: string
  userId: string
}

export type UpdateProjectParams = CreateProjectParams & DeleteProjectParams

// Params
export interface ListProjectParams {
  userId: string
}

export interface GetProjectParams {
  projectId: string
}

export interface ListProjectMembersParams {
  projectId: string
}
