import { ElectronAPI } from '@electron-toolkit/preload'
import { IpcChannel, IpcRequest, IpcResponse } from '@interface/CoreInterface'

declare global {
  interface Window {
    electron: ElectronAPI
    callApi: <T extends IpcChannel>(channel: T, data?: IpcRequest<T>) => Promise<IpcResponse<T>>
  }
}
