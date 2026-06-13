import { CoreBaseHandler } from '@/base/CoreBaseHandler'
import { IpcChannel, type UpdateLabelParams } from '@/interface/CoreInterface'

export class UpdateLabelHandler extends CoreBaseHandler<IpcChannel.LABEL_UPDATE> {
  constructor() {
    super(IpcChannel.LABEL_UPDATE)
  }

  async handler(params: UpdateLabelParams) {
    const label = await this.repos.labels.update(params.labelId, {
      labelName: params.labelName,
      labelColor: params.labelColor
    })
    return { data: label, error: null }
  }
}
