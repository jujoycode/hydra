import type { Meta, StoryObj } from '@storybook/react'
import { HorizontalBarChart } from './HorizontalBarChart'

const meta: Meta<typeof HorizontalBarChart> = {
  title: 'Atoms/Charts/HorizontalBarChart',
  component: HorizontalBarChart,
  decorators: [
    (Story) => (
      <div className='w-[480px]'>
        <Story />
      </div>
    )
  ]
}
export default meta
type Story = StoryObj<typeof HorizontalBarChart>

export const Default: Story = {
  args: {
    dataKey: 'count',
    data: [
      { name: 'Alice', count: 12 },
      { name: 'Bob', count: 8 },
      { name: 'Carol', count: 5 },
      { name: 'Dave', count: 3 }
    ]
  }
}
