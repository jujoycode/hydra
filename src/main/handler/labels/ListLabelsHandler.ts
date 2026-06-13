import { CoreBaseHandler } from '@/base/CoreBaseHandler'
import { IpcChannel } from '@/interface/CoreInterface'

export class ListLabelsHandler extends CoreBaseHandler<IpcChannel.LABEL_LIST> {
  constructor() {
    super(IpcChannel.LABEL_LIST)
  }

  async handler() {
    const labels = await this.repos.labels.findAll()
    return { data: labels, error: null }
  }
}
