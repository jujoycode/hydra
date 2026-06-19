import type { Meta, StoryObj } from '@storybook/react'
import { Skeleton } from './Skeleton'

/**
 * 데이터가 도착하기 전 콘텐츠 자리를 채워두는 플레이스홀더로, animate-pulse로 은은하게 깜빡인다.
 * 폭과 높이, 둥글기 등 모양은 전부 className으로 지정한다. 실제 내용과 비슷한 형태로 배치하면 로딩이
 * 끝나는 순간 레이아웃이 어긋나는 현상을 줄일 수 있다.
 */
const meta: Meta<typeof Skeleton> = {
  title: 'Atoms/Skeleton',
  component: Skeleton,
  parameters: { layout: 'centered' },
  argTypes: {
    className: {
      description: '크기와 모양을 지정하는 유틸리티 클래스. h-*로 높이, w-*로 폭, rounded-*로 둥글기를 지정한다.',
      control: 'text',
      table: { type: { summary: 'string' } }
    }
  }
}

export default meta
type Story = StoryObj<typeof Skeleton>

/** 한 줄 텍스트 너비의 막대 형태. */
export const Default: Story = {
  args: { className: 'h-6 w-40' }
}

/** 원형. 아바타가 들어갈 자리에 배치한다. */
export const Circle: Story = {
  args: { className: 'h-12 w-12 rounded-full' }
}

/** 여러 개를 조합해 카드 로딩 상태를 표현한 경우. */
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
