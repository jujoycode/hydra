import type { Meta, StoryObj } from '@storybook/react'
import { AreaTrendChart } from './AreaTrendChart'

const meta: Meta<typeof AreaTrendChart> = {
  title: 'Atoms/Charts/AreaTrendChart',
  component: AreaTrendChart,
  decorators: [
    (Story) => (
      <div className='w-[480px]'>
        <Story />
      </div>
    )
  ]
}
export default meta
type Story = StoryObj<typeof AreaTrendChart>

export const Default: Story = {
  args: {
    data: [
      { name: 'Mon', created: 4, closed: 2 },
      { name: 'Tue', created: 6, closed: 5 },
      { name: 'Wed', created: 3, closed: 4 },
      { name: 'Thu', created: 8, closed: 6 },
      { name: 'Fri', created: 5, closed: 7 }
    ],
    lines: [
      { dataKey: 'created', name: 'Created', color: 'var(--chart-1)', gradientId: 'g-created' },
      { dataKey: 'closed', name: 'Closed', color: 'var(--chart-2)', gradientId: 'g-closed' }
    ]
  }
}
