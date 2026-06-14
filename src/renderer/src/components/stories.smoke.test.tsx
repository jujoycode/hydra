import { composeStories } from '@storybook/react'
import { cleanup, render } from '@testing-library/react'
import type { ComponentType } from 'react'
import { afterEach, describe, expect, it } from 'vitest'

// 모든 *.stories.tsx를 자동 수집해 portable stories로 스모크 렌더한다.
// 새 스토리를 추가하면 별도 테스트 작성 없이 자동으로 커버된다(렌더 중 throw가 없는지 검증).
type StoryModule = Parameters<typeof composeStories>[0]
const storyModules = import.meta.glob<StoryModule>('./**/*.stories.tsx', { eager: true })

afterEach(cleanup)

describe('component stories smoke', () => {
  const entries = Object.entries(storyModules)

  it('수집된 스토리 모듈이 존재한다', () => {
    expect(entries.length).toBeGreaterThan(0)
  })

  for (const [path, mod] of entries) {
    const composed = composeStories(mod)
    const relPath = path.replace(/^\.\//, '')

    for (const [name, Story] of Object.entries(composed) as [string, ComponentType][]) {
      it(`${relPath} → ${name} 렌더`, () => {
        const { container } = render(<Story />)
        expect(container).toBeInTheDocument()
      })
    }
  }
})
