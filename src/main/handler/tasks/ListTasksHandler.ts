import { CoreBaseHandler } from '@/base/CoreBaseHandler'
import { IpcChannel, type ListTasksParams } from '@/interface/CoreInterface'

export class ListTasksHandler extends CoreBaseHandler<IpcChannel.TASK_LIST> {
  constructor() {
    super(IpcChannel.TASK_LIST)
  }

  async handler(params: ListTasksParams) {
    const tasks = await this.repos.tasks.findByIssue(params.issueId)
    return { data: tasks, error: null }
  }
}
