import type { Meta, StoryObj } from '@storybook/react'
import { InputField } from './InputField'

const meta: Meta<typeof InputField> = {
  title: 'Molecules/InputField',
  component: InputField,
  decorators: [
    (Story) => (
      <div className='w-80 p-6'>
        <Story />
      </div>
    )
  ]
}
export default meta
type Story = StoryObj<typeof InputField>

export const Text: Story = {
  render: () => (
    <InputField label='Email'>
      <InputField.Email placeholder='you@example.com' />
    </InputField>
  )
}

export const Password: Story = {
  render: () => (
    <InputField label='Password'>
      <InputField.Password />
    </InputField>
  )
}

export const WithError: Story = {
  render: () => (
    <InputField label='Email' error='Invalid email address'>
      <InputField.Email placeholder='you@example.com' />
    </InputField>
  )
}
