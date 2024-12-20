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
    plugins: [externalizeDepsPlugin()],
    resolve: {
      alias: {
        '@interface': resolve('src/main/core/interface')
      }
    }
  },
  renderer: {
    resolve: {
      alias: {
        '@components': resolve('src/renderer/src/components'),
        '@layouts': resolve('src/renderer/src/layouts'),
        '@pages': resolve('src/renderer/src/pages'),
        '@hooks': resolve('src/renderer/src/hooks'),
        '@stores': resolve('src/renderer/src/stores'),
        '@utils': resolve('src/renderer/src/utils'),
        '@interface': resolve('src/main/core/interface')
      }
    },
    plugins: [react()]
  }
})
