export interface CreateTaskData {
  taskId: string
  issueId: string
  taskTitle: string
  taskOrder?: number
  createdBy: string
}

export interface TaskRecord {
  task_id: string
  issue_id: string | null
  task_title: string
  task_completed: boolean | null
  task_order: number | null
  task_created_by: string | null
  task_created_at: Date | null
  task_updated_at: Date | null
}

export interface TaskRepository {
  create(data: CreateTaskData): Promise<TaskRecord>
  findByIssue(issueId: string): Promise<TaskRecord[]>
  update(taskId: string, data: { taskTitle?: string; taskCompleted?: boolean; taskOrder?: number }): Promise<TaskRecord>
  delete(taskId: string): Promise<boolean>
}
