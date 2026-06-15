import type { Meta, StoryObj } from '@storybook/react'
import { UserAvatar } from './UserAvatar'

const meta: Meta<typeof UserAvatar> = {
  title: 'Molecules/UserAvatar',
  component: UserAvatar
}
export default meta
type Story = StoryObj<typeof UserAvatar>

export const Default: Story = { args: { name: 'Alice Kim' } }
export const WithInfo: Story = { args: { name: 'Alice Kim', email: 'alice@example.com', showInfo: true } }
export const Large: Story = { args: { name: 'Alice Kim', email: 'alice@example.com', showInfo: true, size: 'lg' } }
