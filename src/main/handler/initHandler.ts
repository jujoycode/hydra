import { ipcMain } from 'electron/main'

export function initHandler() {
  const handler = []
  handler.forEach(({ channel, handler }) => ipcMain.on(channel, handler))
}
