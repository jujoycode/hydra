import { resolve } from 'node:path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react-swc'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()],
    resolve: {
      alias: {
        '@/base': resolve('src/main/core/base'),
        '@/constant': resolve('src/main/core/constant'),
        '@/database': resolve('src/main/core/database'),
        '@/interface': resolve('src/main/core/interface'),
        '@/lib': resolve('src/main/core/lib'),
        '@/util': resolve('src/main/core/util'),
        '@/handler': resolve('src/main/handler'),
        '@/workspace': resolve('src/main/core/workspace'),
        '@/error': resolve('src/main/core/error')
      }
    }
  },
  preload: {
    plugins: [externalizeDepsPlugin()],
    resolve: {
      alias: {
        '@/interface': resolve('src/main/core/interface')
      }
    }
  },
  renderer: {
    resolve: {
      alias: {
        '@/': resolve('renderer/src'),
        '@/components': resolve('src/renderer/src/components'),
        '@/atoms': resolve('src/renderer/src/components/atoms'),
        '@/molecules': resolve('src/renderer/src/components/molecules'),
        '@/organisms': resolve('src/renderer/src/components/organisms'),
        '@/pages': resolve('src/renderer/src/components/pages'),
        '@/layouts': resolve('src/renderer/src/components/layouts'),
        '@/templates': resolve('src/renderer/src/components/templates'),
        '@/routers': resolve('src/renderer/src/routers'),
        '@/lib': resolve('src/renderer/src/lib'),
        '@/hooks': resolve('src/renderer/src/hooks'),
        '@/types': resolve('src/renderer/src/types'),
        '@/stores': resolve('src/renderer/src/stores'),
        '@/utils': resolve('src/renderer/src/utils'),
        '@/constants': resolve('src/renderer/src/constants'),
        '@/interface': resolve('src/main/core/interface')
      }
    },
    plugins: [react(), tailwindcss()]
  }
})
