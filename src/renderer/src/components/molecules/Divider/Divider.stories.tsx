import type { Meta, StoryObj } from '@storybook/react'
import { Divider } from './Divider'

const meta: Meta<typeof Divider> = {
  title: 'Molecules/Divider',
  component: Divider,
  decorators: [
    (Story) => (
      <div className='w-80 p-6'>
        <Story />
      </div>
    )
  ]
}
export default meta
type Story = StoryObj<typeof Divider>

export const Default: Story = { args: { text: 'OR' } }
export const Continue: Story = { args: { text: 'Or continue with' } }
