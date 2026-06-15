import type { Meta, StoryObj } from '@storybook/react'
import { TableEmpty } from './TableEmpty'

const meta: Meta<typeof TableEmpty> = {
  title: 'Molecules/TableEmpty',
  component: TableEmpty,
  decorators: [
    (Story) => (
      <div className='w-96 rounded-lg border'>
        <Story />
      </div>
    )
  ]
}
export default meta
type Story = StoryObj<typeof TableEmpty>

export const Empty: Story = {
  args: { message: 'No issues found', description: 'Create your first issue to get started' }
}
export const Loading: Story = { args: { isLoading: true } }
