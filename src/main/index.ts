import { app, shell, BrowserWindow } from 'electron'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import { CoreConstant } from '@constant/CoreConstant'
import { CoreUtil } from '@util/CoreUtil'
import { initHandler } from '@handler/initHandler'

function createWindow() {
  const main = new BrowserWindow({
    width: 1100,
    height: 650,
    show: false,
    autoHideMenuBar: true,
    webPreferences: {
      preload: CoreUtil.pathJoin(__dirname, '..', 'preload', 'index.js'),
      sandbox: false
    }
  })

  main.on('ready-to-show', () => {
    main.show()
  })

  main.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    main.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    main.loadFile(CoreUtil.pathJoin(__dirname, '..', 'renderer', 'index.html'))
  }
}

// initialization and is ready to create browser windows.
app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  initHandler()
  createWindow()

  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== CoreConstant.OS_TYPE.MAC) {
    app.quit()
  }
})
