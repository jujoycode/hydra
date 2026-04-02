import { CoreBaseHandler } from '@/base/CoreBaseHandler'
import { type DeleteLabelParams, IpcChannel } from '@/interface/CoreInterface'

export class DeleteLabelHandler extends CoreBaseHandler<IpcChannel.LABEL_DELETE> {
  constructor() {
    super(IpcChannel.LABEL_DELETE)
  }

  async handler(params: DeleteLabelParams) {
    const result = await this.repos.labels.delete(params.labelId)
    return { data: result, error: null }
  }
}
