import { resolve } from 'node:path'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['src/main/**/*.test.ts'],
    coverage: {
      provider: 'v8',
      include: ['src/main/**/*.ts'],
      exclude: ['src/main/**/*.test.ts', 'src/main/**/index.ts']
    }
  },
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
})
