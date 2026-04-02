import { CoreBaseHandler } from '@/base/CoreBaseHandler'
import { type DeleteMilestoneParams, IpcChannel } from '@/interface/CoreInterface'

export class DeleteMilestoneHandler extends CoreBaseHandler<IpcChannel.MILESTONE_DELETE> {
  constructor() {
    super(IpcChannel.MILESTONE_DELETE)
  }

  async handler(params: DeleteMilestoneParams) {
    const result = await this.repos.milestones.delete(params.milestoneId)
    return { data: result, error: null }
  }
}
