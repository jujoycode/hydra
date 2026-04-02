import { CoreBaseHandler } from '@/base/CoreBaseHandler'
import { type DeleteTaskParams, IpcChannel } from '@/interface/CoreInterface'

export class DeleteTaskHandler extends CoreBaseHandler<IpcChannel.TASK_DELETE> {
  constructor() {
    super(IpcChannel.TASK_DELETE)
  }

  async handler(params: DeleteTaskParams) {
    const result = await this.repos.tasks.delete(params.taskId)
    return { data: result, error: null }
  }
}
