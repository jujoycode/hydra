import { electronAPI } from '@electron-toolkit/preload'
import { contextBridge, ipcRenderer } from 'electron'
import { IpcChannel, type IpcRequest, type IpcResponse } from '@/interface/CoreInterface'

// Custom APIs for renderer
function checkSupportedIpcChannel(channel: IpcChannel) {
  if (!Object.values(IpcChannel).includes(channel)) {
    throw new Error('Not supported IPC channel')
  }
}

async function callOnce<T extends IpcChannel>(channel: T, data?: IpcRequest<T>): Promise<IpcResponse<T>> {
  checkSupportedIpcChannel(channel)
  return ipcRenderer.invoke(channel, data)
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('callApi', callOnce)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-expect-error (define in d.ts)
  window.electron = electronAPI
  // @ts-expect-error (define in d.ts)
  window.callApi = callOnce
}
