import { asc, eq } from 'drizzle-orm'
import type { NodePgDatabase } from 'drizzle-orm/node-postgres'
import * as schema from '../../schema/drizzle/schema'
import type { CreateTaskData, TaskRecord, TaskRepository } from '../interfaces/TaskRepository'

const { tasks } = schema

export class DrizzleTaskRepository implements TaskRepository {
  constructor(private db: NodePgDatabase<typeof schema>) {}

  async create(data: CreateTaskData): Promise<TaskRecord> {
    const now = new Date()
    const rows = await this.db
      .insert(tasks)
      .values({
        task_id: data.taskId,
        issue_id: data.issueId,
        task_title: data.taskTitle,
        task_order: data.taskOrder ?? 0,
        task_created_by: data.createdBy,
        task_created_at: now,
        task_updated_at: now
      })
      .returning()
    return rows[0] as TaskRecord
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

    const rows = await this.db.update(tasks).set(updateData).where(eq(tasks.task_id, taskId)).returning()
    return rows[0] as TaskRecord
  }

  async delete(taskId: string): Promise<boolean> {
    await this.db.delete(tasks).where(eq(tasks.task_id, taskId))
    return true
  }
}
