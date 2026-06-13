import { CoreBaseHandler } from '@/base/CoreBaseHandler'
import { IpcChannel, type ListMilestonesParams } from '@/interface/CoreInterface'

export class ListMilestonesHandler extends CoreBaseHandler<IpcChannel.MILESTONE_LIST> {
  constructor() {
    super(IpcChannel.MILESTONE_LIST)
  }

  async handler(params: ListMilestonesParams) {
    const milestones = await this.repos.milestones.findByProject(params.projectId)
    return { data: milestones, error: null }
  }
}
