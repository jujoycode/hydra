import type { Meta, StoryObj } from '@storybook/react'
import { StatusDonutChart } from './StatusDonutChart'

const meta: Meta<typeof StatusDonutChart> = {
  title: 'Atoms/Charts/StatusDonutChart',
  component: StatusDonutChart,
  decorators: [
    (Story) => (
      <div className='w-96'>
        <Story />
      </div>
    )
  ]
}
export default meta
type Story = StoryObj<typeof StatusDonutChart>

export const Default: Story = {
  args: {
    data: [
      { name: 'Backlog', value: 8, color: 'var(--chart-1)' },
      { name: 'In Progress', value: 5, color: 'var(--chart-2)' },
      { name: 'Review', value: 3, color: 'var(--chart-3)' },
      { name: 'Done', value: 12, color: 'var(--chart-4)' }
    ]
  }
}
