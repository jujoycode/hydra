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
        '@database': resolve('src/main/core/database'),
        '@interface': resolve('src/main/core/interface'),
        '@lib': resolve('src/main/core/lib'),
        '@util': resolve('src/main/core/util'),
        '@handler': resolve('src/main/handler')
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
        '@pages': resolve('src/renderer/src/pages'),
        '@hooks': resolve('src/renderer/src/hooks')
      }
    },
    plugins: [react()]
  }
})
