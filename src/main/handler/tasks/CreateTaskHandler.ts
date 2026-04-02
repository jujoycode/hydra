import { CoreBaseHandler } from '@/base/CoreBaseHandler'
import { type CreateTaskParams, IpcChannel } from '@/interface/CoreInterface'
import { CoreUtil } from '@/util/CoreUtil'

export class CreateTaskHandler extends CoreBaseHandler<IpcChannel.TASK_CREATE> {
  constructor() {
    super(IpcChannel.TASK_CREATE)
  }

  async handler(params: CreateTaskParams) {
    const task = await this.repos.tasks.create({
      taskId: CoreUtil.getUuid(),
      issueId: params.issueId,
      taskTitle: params.taskTitle,
      createdBy: params.userId
    })
    return { data: task, error: null }
  }
}
