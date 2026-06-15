import type { Meta, StoryObj } from '@storybook/react'
import { CircleDashed } from 'lucide-react'
import { StatCard } from './StatCard'

const meta: Meta<typeof StatCard> = {
  title: 'Molecules/StatCard',
  component: StatCard,
  decorators: [
    (Story) => (
      <div className='w-64'>
        <Story />
      </div>
    )
  ]
}
export default meta
type Story = StoryObj<typeof StatCard>

export const Default: Story = {
  args: {
    title: 'Open issues',
    value: 24,
    icon: <CircleDashed size={18} />,
    description: 'this week'
  }
}
