import type { Meta, StoryObj } from '@storybook/react'
import { Skeleton } from './Skeleton'

/**
 * 로딩 중 콘텐츠 자리를 채우는 펄스 플레이스홀더. `animate-pulse`로 깜빡인다.
 *
 * - 크기/모양은 전적으로 `className`으로 지정한다(폭·높이·둥글기).
 * - 실제 콘텐츠와 비슷한 형태로 배치해 레이아웃 점프를 줄인다.
 */
const meta: Meta<typeof Skeleton> = {
  title: 'Atoms/Skeleton',
  component: Skeleton,
  parameters: { layout: 'centered' },
  argTypes: {
    className: {
      description: '스켈레톤 크기/모양을 정하는 유틸리티 클래스(h-*, w-*, rounded-* 등).',
      control: 'text',
      table: { type: { summary: 'string' } }
    }
  }
}

export default meta
type Story = StoryObj<typeof Skeleton>

/** 한 줄 텍스트 폭의 막대 스켈레톤. */
export const Default: Story = {
  args: { className: 'h-6 w-40' }
}

/** 원형 스켈레톤. 아바타 자리에 사용한다. */
export const Circle: Story = {
  args: { className: 'h-12 w-12 rounded-full' }
}

/** 여러 스켈레톤을 조합해 카드 로딩 형태를 표현한 예. */
export const CardPlaceholder: Story = {
  render: () => (
    <div className='flex w-72 items-center gap-3'>
      <Skeleton className='h-12 w-12 rounded-full' />
      <div className='flex-1 space-y-2'>
        <Skeleton className='h-4 w-32' />
        <Skeleton className='h-3 w-20' />
      </div>
    </div>
  )
}
