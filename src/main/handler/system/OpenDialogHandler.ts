import { CoreBaseHandler } from '@base/CoreBaseHandler'
import { dialog } from 'electron'
import { IpcChannel, type OpenDialogOptions, OpenDialogReturnValue } from '@interface/CoreInterface'

/**
 * Dialog 호출 후 경로를 반환받는 핸들러
 * @extends CoreBaseHandler
 */
export class OepnDialogHandler extends CoreBaseHandler {
  constructor() {
    super(IpcChannel.SYSTEM_OPEN_DIALOG)
  }

  async handler(params: OpenDialogOptions): Promise<OpenDialogReturnValue> {
    return await dialog.showOpenDialog(params)
  }
}
