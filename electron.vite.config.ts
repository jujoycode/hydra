import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'path'

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()],
    resolve: {
      alias: {
        '@base': resolve('src/main/core/base'),
        '@constant': resolve('src/main/core/constant'),
        '@database': resolve('src/main/core/database'),
        '@interface': resolve('src/main/core/interface'),
        '@/lib': resolve('src/main/core/lib'),
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
        '@/': resolve(__dirname, './renderer/src'),
        '@/components': resolve(__dirname, './src/renderer/src/components'),
        '@/atoms': resolve(__dirname, './src/renderer/src/components/atoms'),
        '@/molecules': resolve(__dirname, './src/renderer/src/components/molecules'),
        '@/organisms': resolve(__dirname, './src/renderer/src/components/organisms'),
        '@/pages': resolve(__dirname, './src/renderer/src/components/pages'),
        '@/layouts': resolve(__dirname, './src/renderer/src/components/layouts'),
        '@/templates': resolve(__dirname, './src/renderer/src/components/templates'),
        '@/routers': resolve(__dirname, './src/renderer/src/routers'),
        '@/lib': resolve(__dirname, './src/renderer/src/lib'),
        '@/hooks': resolve(__dirname, './src/renderer/src/hooks'),
        '@/types': resolve(__dirname, './src/renderer/src/types'),
        '@/stores': resolve('src/renderer/src/stores'),
        '@/utils': resolve('src/renderer/src/utils'),
        '@/constants': resolve('src/renderer/src/constants'),
        '@/interface': resolve('src/main/core/interface')
      }
    },
    plugins: [react(), tailwindcss()]
  }
})
