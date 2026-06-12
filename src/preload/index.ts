import { electronAPI } from '@electron-toolkit/preload'
import { contextBridge, ipcRenderer } from 'electron'
import { IpcChannel, type IpcRequest, type IpcResponse } from '@/interface/CoreInterface'
import { getMockResponse } from './mockApi'

// TEMP(디자인 미리보기): true면 DB 대신 mock 데이터를 반환. 정식 연결 복구 시 false.
const MOCK_API = false

// Custom APIs for renderer
function checkSupportedIpcChannel(channel: IpcChannel) {
  if (!Object.values(IpcChannel).includes(channel)) {
    throw new Error('Not supported IPC channel')
  }
}

async function callOnce<T extends IpcChannel>(channel: T, data?: IpcRequest<T>): Promise<IpcResponse<T>> {
  checkSupportedIpcChannel(channel)
  if (MOCK_API) {
    return getMockResponse(channel, data) as IpcResponse<T>
  }
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
