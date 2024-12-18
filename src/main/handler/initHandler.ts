import { ipcMain } from 'electron/main'
import type { CoreBaseHandler } from '@base/CoreBaseHandler'

export function initHandler() {
  const handler: CoreBaseHandler[] = []
  handler.forEach(({ ipcChannel, handler }) => ipcMain.on(ipcChannel, handler))
}
