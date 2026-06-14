import type { Meta, StoryObj } from '@storybook/react'
import { Avatar, AvatarFallback, AvatarImage } from './Avatar'

const meta: Meta<typeof Avatar> = {
  title: 'Atoms/Avatar',
  component: Avatar
}
export default meta
type Story = StoryObj<typeof Avatar>

export const WithImage: Story = {
  render: () => (
    <Avatar>
      <AvatarImage src='https://avatars.githubusercontent.com/u/167082674?v=4' alt='avatar' />
      <AvatarFallback>HY</AvatarFallback>
    </Avatar>
  )
}
export const Fallback: Story = {
  render: () => (
    <Avatar>
      <AvatarFallback>HY</AvatarFallback>
    </Avatar>
  )
}
