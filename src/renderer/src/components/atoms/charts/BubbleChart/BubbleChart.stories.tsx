import type { Meta, StoryObj } from '@storybook/react'
import { BubbleChart } from './BubbleChart'

const meta: Meta<typeof BubbleChart> = {
  title: 'Atoms/Charts/BubbleChart',
  component: BubbleChart,
  decorators: [
    (Story) => (
      <div className='w-[480px]'>
        <Story />
      </div>
    )
  ]
}
export default meta
type Story = StoryObj<typeof BubbleChart>

export const Default: Story = {
  args: {
    data: [
      { name: 'Bug', value: 12, count: 8 },
      { name: 'Feature', value: 20, count: 5 },
      { name: 'Chore', value: 6, count: 12 },
      { name: 'Docs', value: 4, count: 3 }
    ]
  }
}
