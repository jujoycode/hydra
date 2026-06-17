import type { Meta, StoryObj } from '@storybook/react'
import { Separator } from './Separator'

/**
 * 콘텐츠 사이를 가르는 1px 구분선으로, Radix Separator 기반이다. orientation으로 가로나 세로를 정하는데,
 * 세로선은 부모 높이를 따라가므로 높이가 잡힌 컨테이너 안에 둬야 보인다. 기본값인 decorative가 켜져 있어
 * 스크린리더에는 안 잡히고, 의미상 꼭 나눠 읽혀야 하는 자리라면 decorative를 꺼주면 된다.
 */
const meta: Meta<typeof Separator> = {
  title: 'Atoms/Separator',
  component: Separator,
  argTypes: {
    orientation: {
      description: '선의 방향. horizontal이면 가로로 눕고 vertical이면 세로로 선다.',
      control: 'inline-radio',
      options: ['horizontal', 'vertical'],
      table: { type: { summary: 'horizontal | vertical' }, defaultValue: { summary: 'horizontal' } }
    },
    decorative: {
      description: '켜면 그냥 장식으로 보고 접근성 트리에서 빼버린다.',
      control: 'boolean',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'true' } }
    }
  }
}
export default meta
type Story = StoryObj<typeof Separator>

/** 가로선으로 위아래를 가른 모양. */
export const Horizontal: Story = {
  render: () => (
    <div className='w-64'>
      <p className='text-sm'>위</p>
      <Separator className='my-2' />
      <p className='text-sm'>아래</p>
    </div>
  )
}

/** 세로선으로 좌우를 가른 모양. 부모에 높이가 있어야 보인다. */
export const Vertical: Story = {
  render: () => (
    <div className='flex h-8 items-center'>
      <span className='text-sm'>왼쪽</span>
      <Separator orientation='vertical' className='mx-3' />
      <span className='text-sm'>오른쪽</span>
    </div>
  )
}
