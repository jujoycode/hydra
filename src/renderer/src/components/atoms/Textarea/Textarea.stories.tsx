import type { Meta, StoryObj } from '@storybook/react'
import { Textarea } from './Textarea'

const meta: Meta<typeof Textarea> = {
  title: 'Atoms/Textarea',
  component: Textarea,
  args: { placeholder: 'Write a description…' }
}
export default meta
type Story = StoryObj<typeof Textarea>

export const Default: Story = {}
export const Disabled: Story = { args: { disabled: true } }
