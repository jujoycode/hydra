import { asc, eq } from 'drizzle-orm'
import * as schema from '../../schema/drizzle/schema'
import type { CreateTaskData, TaskRecord, TaskRepository } from '../interfaces/TaskRepository'
import type { DrizzleDb } from './executor'
import { selectById } from './readAfterWrite'

const { tasks } = schema

export class DrizzleTaskRepository implements TaskRepository {
  constructor(private db: DrizzleDb) {}

  async create(data: CreateTaskData): Promise<TaskRecord> {
    const now = new Date()
    await this.db.insert(tasks).values({
      task_id: data.taskId,
      issue_id: data.issueId,
      task_title: data.taskTitle,
      task_order: data.taskOrder ?? 0,
      task_created_by: data.createdBy,
      task_created_at: now,
      task_updated_at: now
    })
    return selectById<TaskRecord>(this.db, tasks, tasks.task_id, data.taskId)
  }

  async findByIssue(issueId: string): Promise<TaskRecord[]> {
    const rows = await this.db.select().from(tasks).where(eq(tasks.issue_id, issueId)).orderBy(asc(tasks.task_order))
    return rows as TaskRecord[]
  }

  async update(
    taskId: string,
    data: { taskTitle?: string; taskCompleted?: boolean; taskOrder?: number }
  ): Promise<TaskRecord> {
    const updateData: Record<string, unknown> = {
      task_updated_at: new Date()
    }
    if (data.taskTitle !== undefined) updateData.task_title = data.taskTitle
    if (data.taskCompleted !== undefined) updateData.task_completed = data.taskCompleted
    if (data.taskOrder !== undefined) updateData.task_order = data.taskOrder

    await this.db.update(tasks).set(updateData).where(eq(tasks.task_id, taskId))
    return selectById<TaskRecord>(this.db, tasks, tasks.task_id, taskId)
  }

  async delete(taskId: string): Promise<boolean> {
    await this.db.delete(tasks).where(eq(tasks.task_id, taskId))
    return true
  }
}
