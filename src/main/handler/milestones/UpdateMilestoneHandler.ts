import { CoreBaseHandler } from '@/base/CoreBaseHandler'
import { IpcChannel, type UpdateMilestoneParams } from '@/interface/CoreInterface'

export class UpdateMilestoneHandler extends CoreBaseHandler<IpcChannel.MILESTONE_UPDATE> {
  constructor() {
    super(IpcChannel.MILESTONE_UPDATE)
  }

  async handler(params: UpdateMilestoneParams) {
    const milestone = await this.repos.milestones.update(params.milestoneId, {
      milestoneTitle: params.milestoneTitle,
      milestoneDesc: params.milestoneDesc,
      milestoneDueDate: params.milestoneDueDate ? new Date(params.milestoneDueDate) : undefined,
      milestoneStatus: params.milestoneStatus
    })
    return { data: milestone, error: null }
  }
}
