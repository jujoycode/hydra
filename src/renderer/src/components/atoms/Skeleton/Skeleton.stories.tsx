import type { Meta, StoryObj } from '@storybook/react'
import { Skeleton } from './Skeleton'

/**
 * 데이터가 오기 전 콘텐츠 자리를 미리 채워두는 플레이스홀더로, animate-pulse 덕에 은은하게 깜빡인다.
 * 폭이든 높이든 둥글기든 모양은 전부 className으로 잡는다. 실제로 들어올 내용과 비슷한 형태로 깔아두면
 * 로딩이 끝나는 순간 레이아웃이 덜컥 튀는 걸 줄일 수 있다.
 */
const meta: Meta<typeof Skeleton> = {
  title: 'Atoms/Skeleton',
  component: Skeleton,
  parameters: { layout: 'centered' },
  argTypes: {
    className: {
      description: '크기와 모양을 잡는 유틸리티 클래스. h-*로 높이, w-*로 폭, rounded-*로 둥글기를 준다.',
      control: 'text',
      table: { type: { summary: 'string' } }
    }
  }
}

export default meta
type Story = StoryObj<typeof Skeleton>

/** 한 줄 텍스트만 한 막대 모양. */
export const Default: Story = {
  args: { className: 'h-6 w-40' }
}

/** 동그란 모양. 아바타 들어갈 자리에 깐다. */
export const Circle: Story = {
  args: { className: 'h-12 w-12 rounded-full' }
}

/** 여러 개를 조합해 카드가 로딩되는 모습을 흉내 낸 경우. */
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
