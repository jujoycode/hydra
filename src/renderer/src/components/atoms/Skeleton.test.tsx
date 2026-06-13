import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Skeleton } from './Skeleton'

describe('Skeleton', () => {
  it('펄스 애니메이션과 커스텀 클래스로 렌더된다', () => {
    const { container } = render(<Skeleton className='h-4 w-10' />)
    const el = container.firstChild as HTMLElement
    expect(el).toBeInTheDocument()
    expect(el).toHaveClass('animate-pulse', 'h-4')
    expect(el).toHaveAttribute('data-slot', 'skeleton')
  })
})
