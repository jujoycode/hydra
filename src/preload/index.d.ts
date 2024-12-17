import { ElectronAPI } from '@electron-toolkit/preload'

interface CustomAPI {
  getOS: () => {
    isMac: boolean
    isWin: boolean
    isLinux: boolean
  }
}

declare global {
  interface Window {
    electron: ElectronAPI
    api: CustomAPI
  }
}
