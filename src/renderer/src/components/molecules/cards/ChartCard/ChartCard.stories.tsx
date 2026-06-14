import type { Meta, StoryObj } from '@storybook/react'
import { ChartCard } from './ChartCard'

const meta: Meta<typeof ChartCard> = {
  title: 'Molecules/ChartCard',
  component: ChartCard,
  decorators: [
    (Story) => (
      <div className='w-[480px]'>
        <Story />
      </div>
    )
  ]
}
export default meta
type Story = StoryObj<typeof ChartCard>

export const Default: Story = {
  args: {
    title: 'Issues by status',
    description: '현재 스프린트 기준',
    children: (
      <div className='flex h-40 items-center justify-center rounded-md bg-muted text-sm text-muted-foreground'>
        차트 영역
      </div>
    )
  }
}
