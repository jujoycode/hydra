import type { Meta, StoryObj } from '@storybook/react'
import { Separator } from './Separator'

/**
 * 콘텐츠 사이를 나누는 1px 구분선으로, Radix Separator 기반이다. orientation으로 가로 또는 세로를 정하며,
 * 세로선은 부모 높이를 따르므로 높이가 지정된 컨테이너 안에 두어야 보인다. 기본값인 decorative가 켜져 있어
 * 스크린리더에 노출되지 않으며, 의미상 구분이 필요한 자리라면 decorative를 끈다.
 */
const meta: Meta<typeof Separator> = {
  title: 'Atoms/Separator',
  component: Separator,
  argTypes: {
    orientation: {
      description: '선의 방향. horizontal은 가로, vertical은 세로로 표시된다.',
      control: 'inline-radio',
      options: ['horizontal', 'vertical'],
      table: { type: { summary: 'horizontal | vertical' }, defaultValue: { summary: 'horizontal' } }
    },
    decorative: {
      description: '켜면 장식으로 간주하여 접근성 트리에서 제외한다.',
      control: 'boolean',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'true' } }
    }
  }
}
export default meta
type Story = StoryObj<typeof Separator>

/** 가로선으로 위아래를 나눈 형태. */
export const Horizontal: Story = {
  render: () => (
    <div className='w-64'>
      <p className='text-sm'>위</p>
      <Separator className='my-2' />
      <p className='text-sm'>아래</p>
    </div>
  )
}

/** 세로선으로 좌우를 나눈 형태. 부모에 높이가 있어야 보인다. */
export const Vertical: Story = {
  render: () => (
    <div className='flex h-8 items-center'>
      <span className='text-sm'>왼쪽</span>
      <Separator orientation='vertical' className='mx-3' />
      <span className='text-sm'>오른쪽</span>
    </div>
  )
}
