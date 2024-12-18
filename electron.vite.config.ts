import { resolve } from 'path'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()],
    resolve: {
      alias: {
        '@base': resolve('src/main/core/base'),
        '@constant': resolve('src/main/core/constant'),
        '@util': resolve('src/main/core/util'),
        '@handler': resolve('src/main/handler'),
        '@interface': resolve('src/main/core/interface'),
        '@database': resolve('src/main/core/database')
      }
    }
  },
  preload: {
    plugins: [externalizeDepsPlugin()]
  },
  renderer: {
    resolve: {
      alias: {
        '@components': resolve('src/renderer/src/components'),
        '@layouts': resolve('src/renderer/src/layouts'),
        '@pages': resolve('src/renderer/src/pages'),
        '@hooks': resolve('src/renderer/src/hooks')
      }
    },
    plugins: [react()]
  }
})
