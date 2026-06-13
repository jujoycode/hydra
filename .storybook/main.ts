import { resolve } from 'node:path'
import type { StorybookConfig } from '@storybook/react-vite'

// 렌더러 '@/' alias (vitest.config.ts와 동일 매핑) — Storybook의 vite가 인식하도록 주입한다.
const rendererAliases: Record<string, string> = {
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

const config: StorybookConfig = {
  stories: ['../src/renderer/src/**/*.stories.@(ts|tsx)'],
  addons: [],
  framework: { name: '@storybook/react-vite', options: {} },
  viteFinal: async (viteConfig) => {
    viteConfig.resolve = viteConfig.resolve ?? {}
    viteConfig.resolve.alias = {
      ...((viteConfig.resolve.alias as Record<string, string>) ?? {}),
      ...rendererAliases
    }
    return viteConfig
  }
}

export default config
