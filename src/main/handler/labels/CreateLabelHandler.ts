import { CoreBaseHandler } from '@/base/CoreBaseHandler'
import { type CreateLabelParams, IpcChannel } from '@/interface/CoreInterface'
import { CoreUtil } from '@/util/CoreUtil'

export class CreateLabelHandler extends CoreBaseHandler<IpcChannel.LABEL_CREATE> {
  constructor() {
    super(IpcChannel.LABEL_CREATE)
  }

  async handler(params: CreateLabelParams) {
    const label = await this.repos.labels.create({
      labelId: CoreUtil.getUuid(),
      labelName: params.labelName,
      labelColor: params.labelColor
    })
    return { data: label, error: null }
  }
}
