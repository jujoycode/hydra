import type { Meta, StoryObj } from '@storybook/react'
import { InfoRow } from './InfoRow'

const meta: Meta<typeof InfoRow> = {
  title: 'Molecules/InfoRow',
  component: InfoRow,
  decorators: [
    (Story) => (
      <div className='w-96 p-6'>
        <Story />
      </div>
    )
  ]
}
export default meta
type Story = StoryObj<typeof InfoRow>

export const Default: Story = { args: { label: 'Status', value: 'In Progress' } }
export const WideLabel: Story = { args: { label: 'Created at', value: '2026-06-14', labelWidth: 2 } }
