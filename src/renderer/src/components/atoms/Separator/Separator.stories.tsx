import type { Meta, StoryObj } from '@storybook/react'
import { Separator } from './Separator'

/**
 * 콘텐츠를 시각적으로 가르는 1px 구분선. Radix Separator 기반이다.
 *
 * - `orientation`으로 가로/세로를 정한다(세로는 부모 높이를 채우므로 높이 있는 컨테이너 필요).
 * - 기본 `decorative=true`라 스크린리더에 노출되지 않는다. 의미상 분리가 필요하면 `decorative=false`.
 */
const meta: Meta<typeof Separator> = {
  title: 'Atoms/Separator',
  component: Separator,
  argTypes: {
    orientation: {
      description: '구분선 방향. horizontal=가로 1px, vertical=세로 1px.',
      control: 'inline-radio',
      options: ['horizontal', 'vertical'],
      table: { type: { summary: 'horizontal | vertical' }, defaultValue: { summary: 'horizontal' } }
    },
    decorative: {
      description: 'true면 장식용으로 간주되어 접근성 트리에서 제외된다.',
      control: 'boolean',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'true' } }
    }
  }
}
export default meta
type Story = StoryObj<typeof Separator>

/** 가로 구분선으로 위/아래 영역을 나눈다. */
export const Horizontal: Story = {
  render: () => (
    <div className='w-64'>
      <p className='text-sm'>위</p>
      <Separator className='my-2' />
      <p className='text-sm'>아래</p>
    </div>
  )
}

/** 세로 구분선으로 좌/우 영역을 나눈다. 부모에 높이가 필요하다. */
export const Vertical: Story = {
  render: () => (
    <div className='flex h-8 items-center'>
      <span className='text-sm'>왼쪽</span>
      <Separator orientation='vertical' className='mx-3' />
      <span className='text-sm'>오른쪽</span>
    </div>
  )
}
