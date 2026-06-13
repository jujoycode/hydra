import { CoreBaseHandler } from '@/base/CoreBaseHandler'
import { type CreateMilestoneParams, IpcChannel } from '@/interface/CoreInterface'
import { CoreUtil } from '@/util/CoreUtil'

export class CreateMilestoneHandler extends CoreBaseHandler<IpcChannel.MILESTONE_CREATE> {
  constructor() {
    super(IpcChannel.MILESTONE_CREATE)
  }

  async handler(params: CreateMilestoneParams) {
    const milestone = await this.repos.milestones.create({
      milestoneId: CoreUtil.getUuid(),
      projectId: params.projectId,
      milestoneTitle: params.milestoneTitle,
      milestoneDesc: params.milestoneDesc ?? null,
      milestoneDueDate: params.milestoneDueDate ? new Date(params.milestoneDueDate) : null
    })
    return { data: milestone, error: null }
  }
}
