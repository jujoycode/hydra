import { resolve } from 'node:path'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

// 메인 프로세스와 렌더러는 같은 '@/' 접두사를 다른 경로로 쓰므로 project별로 alias를 분리한다.
const mainAliases = {
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

const rendererAliases = {
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
  '@/test': resolve('src/renderer/src/test'),
  '@/utils': resolve('src/renderer/src/utils'),
  '@/constants': resolve('src/renderer/src/constants'),
  '@/interface': resolve('src/main/core/interface')
}

export default defineConfig({
  test: {
    projects: [
      {
        test: {
          name: 'main',
          globals: true,
          environment: 'node',
          include: ['src/main/**/*.test.ts']
        },
        resolve: { alias: mainAliases }
      },
      {
        plugins: [react()],
        test: {
          name: 'renderer',
          globals: true,
          environment: 'jsdom',
          include: ['src/renderer/**/*.test.{ts,tsx}'],
          setupFiles: ['./vitest.setup.ts']
        },
        resolve: { alias: rendererAliases }
      }
    ],
    coverage: {
      provider: 'v8',
      include: ['src/main/**/*.ts', 'src/renderer/src/**/*.{ts,tsx}'],
      exclude: [
        '**/*.test.{ts,tsx}',
        '**/*.stories.{ts,tsx}',
        '**/index.ts',
        'src/renderer/src/**/*.d.ts',
        'src/renderer/src/test/**'
      ],
      // 회귀 방지 floor. 미테스트 UI 표면이 커서 초기값은 낮다 — 테스트가 늘면 단계적으로 상향(ratchet).
      // CI는 DB 통합 테스트까지 실행하므로 실제 수치는 이 floor보다 높다.
      thresholds: {
        statements: 8,
        branches: 5,
        functions: 5,
        lines: 8
      }
    }
  }
})
