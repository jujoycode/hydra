import { CoreBaseHandler } from '@/base/CoreBaseHandler'
import { IpcChannel, type UpdateTaskParams } from '@/interface/CoreInterface'

export class UpdateTaskHandler extends CoreBaseHandler<IpcChannel.TASK_UPDATE> {
  constructor() {
    super(IpcChannel.TASK_UPDATE)
  }

  async handler(params: UpdateTaskParams) {
    const task = await this.repos.tasks.update(params.taskId, {
      taskTitle: params.taskTitle,
      taskCompleted: params.taskCompleted,
      taskOrder: params.taskOrder
    })
    return { data: task, error: null }
  }
}
