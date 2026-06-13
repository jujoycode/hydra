import type { TaskRecord } from '../../database/repository/interfaces/TaskRepository'

export type Task = TaskRecord

export interface CreateTaskParams {
  issueId: string
  taskTitle: string
  userId: string
}

export interface UpdateTaskParams {
  taskId: string
  taskTitle?: string
  taskCompleted?: boolean
  taskOrder?: number
}

export interface DeleteTaskParams {
  taskId: string
}

export interface ListTasksParams {
  issueId: string
}
