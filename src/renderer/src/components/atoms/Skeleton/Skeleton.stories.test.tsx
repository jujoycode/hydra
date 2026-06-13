import { composeStories } from '@storybook/react'
import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import * as stories from './Skeleton.stories'

// Storybook 스토리를 portable stories로 vitest(jsdom)에서 스모크 테스트한다.
const { Default, Circle } = composeStories(stories)

describe('Skeleton stories (portable)', () => {
  it('Default 스토리가 렌더된다', () => {
    const { container } = render(<Default />)
    expect(container.firstChild).toBeInTheDocument()
    expect(container.firstChild).toHaveClass('animate-pulse')
  })

  it('Circle 스토리가 렌더된다', () => {
    const { container } = render(<Circle />)
    expect(container.firstChild).toHaveClass('rounded-full')
  })
})
