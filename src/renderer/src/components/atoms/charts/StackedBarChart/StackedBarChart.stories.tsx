import type { Meta, StoryObj } from '@storybook/react'
import { StackedBarChart } from './StackedBarChart'

const meta: Meta<typeof StackedBarChart> = {
  title: 'Atoms/Charts/StackedBarChart',
  component: StackedBarChart,
  decorators: [
    (Story) => (
      <div className='w-[480px]'>
        <Story />
      </div>
    )
  ]
}
export default meta
type Story = StoryObj<typeof StackedBarChart>

export const Default: Story = {
  args: {
    data: [
      { name: 'Sprint 1', done: 8, inProgress: 3 },
      { name: 'Sprint 2', done: 12, inProgress: 5 },
      { name: 'Sprint 3', done: 6, inProgress: 7 }
    ],
    bars: [
      { dataKey: 'done', stackId: 's', fill: 'var(--chart-1)' },
      { dataKey: 'inProgress', stackId: 's', fill: 'var(--chart-2)' }
    ]
  }
}
