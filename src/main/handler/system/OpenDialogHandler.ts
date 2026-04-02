import { dialog } from 'electron'
import { CoreBaseHandler } from '@/base/CoreBaseHandler'
import { IpcChannel, type OpenDialogOptions } from '@/interface/CoreInterface'

/**
 * Dialog 호출 후 경로를 반환받는 핸들러
 * @extends CoreBaseHandler
 */
export class OpenDialogHandler extends CoreBaseHandler<IpcChannel.SYSTEM_OPEN_DIALOG> {
  constructor() {
    super(IpcChannel.SYSTEM_OPEN_DIALOG)
  }

  async handler(params: OpenDialogOptions) {
    const data = await dialog.showOpenDialog(params)

    return { data, error: null }
  }
}
