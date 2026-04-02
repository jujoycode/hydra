// 프로젝트 리포지토리 인터페이스

export interface CreateProjectData {
  projectId: string
  projectName: string
  projectKey: string
  projectDesc?: string | null
  createdBy: string
  startDate?: Date | null
  endDate?: Date | null
}

export interface UpdateProjectData {
  projectName?: string
  projectDesc?: string | null
  modifiedBy?: string
  startDate?: Date | null
  endDate?: Date | null
}

export interface ProjectRecord {
  project_id: string
  project_name: string
  project_key: string
  project_desc: string | null
  project_created_by: string | null
  project_modified_by: string | null
  project_start_date: Date | null
  project_end_date: Date | null
}

export interface ProjectRepository {
  create(data: CreateProjectData): Promise<ProjectRecord>
  findAll(): Promise<ProjectRecord[]>
  findById(projectId: string): Promise<ProjectRecord | null>
  findByUserId(userId: string): Promise<ProjectRecord[]>
  update(projectId: string, data: UpdateProjectData): Promise<ProjectRecord>
  delete(projectId: string): Promise<boolean>
  linkUser(linkId: string, userId: string, projectId: string): Promise<void>
  unlinkUser(userId: string, projectId: string): Promise<void>
  countByCreator(userId: string): Promise<number>
  countByName(name: string): Promise<number>
  countByKey(key: string): Promise<number>
}
