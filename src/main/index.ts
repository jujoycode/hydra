import { electronApp, is, optimizer } from '@electron-toolkit/utils'
import { app, BrowserWindow, shell } from 'electron'
import { CoreConstant } from '@/constant/CoreConstant'
import { initHandler } from '@/handler/initHandler'
import { CoreUtil } from '@/util/CoreUtil'

function simpleLog(message: string) {
  console.log(`\x1b[38;2;128;0;32m[SYSTEM]\x1b[0m [${new Date().toISOString()}] ${message}`)
}

function createWindow() {
  const coreUtil = new CoreUtil()

  const isWindows = process.platform === CoreConstant.OS_TYPE.WINDOWS

  const main = new BrowserWindow({
    width: 1400,
    height: 800,
    show: false,
    autoHideMenuBar: true,
    // 글래스모피즘: 창 배경을 투명하게 두고 OS 머티리얼이 비치도록 한다.
    backgroundColor: '#00000000',
    // Windows 11: acrylic(반투명 흐림), macOS: under-window vibrancy
    ...(isWindows ? { backgroundMaterial: 'acrylic' as const } : { vibrancy: 'under-window' as const }),
    webPreferences: {
      preload: coreUtil.pathJoin(__dirname, '..', 'preload', 'index.mjs'),
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
  if (is.dev && process.env.ELECTRON_RENDERER_URL) {
    main.loadURL(process.env.ELECTRON_RENDERER_URL)
  } else {
    main.loadFile(coreUtil.pathJoin(__dirname, '..', 'renderer', 'index.html'))
  }
}

// initialization and is ready to create browser windows.
app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.electron')
  const startTime = performance.now()

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  console.log(`
    (\`-').->           _(\`-')      (\`-')  (\`-')  _  
    (OO )__      .->  ( (OO ).-><-.(OO )  (OO ).-/  
   ,--. ,'-' ,--.'  ,-.    .'_ ,------,) / ,---.   
   |  | |  |(\`-')'.'  /'\\'-..__)|   /\`. ' | \\ /\`.  
   |  \`-'  |(OO \\    / |  |  ' ||  |_.' | '-'|_.' | 
   |  .-.  | |  /   /) |  |  / :|  .   .'(|  .-.  | 
   |  | |  | \`-/   /\`  |  '-'  /|  |\\  \\  |  | |  | 
   \`--' \`--'   \`--'    \`------' \`--' '--' \`--' \`--' 
`)

  initHandler()

  const windowCreationStart = performance.now()
  createWindow()
  simpleLog(`Window Creation: ${Math.round(performance.now() - windowCreationStart)}ms`)

  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })

  simpleLog(`Total Initialization: ${Math.round(performance.now() - startTime)}ms`)
  simpleLog(`App Ready`)
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== CoreConstant.OS_TYPE.MAC) {
    app.quit()
  }
})
