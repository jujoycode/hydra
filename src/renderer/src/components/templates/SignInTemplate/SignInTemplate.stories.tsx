import type { Meta, StoryObj } from '@storybook/react'
import { SignInTemplate } from './SignInTemplate'

const meta: Meta<typeof SignInTemplate> = {
  title: 'Templates/SignInTemplate',
  component: SignInTemplate,
  decorators: [
    (Story) => (
      <div className='w-[720px] p-6'>
        <Story />
      </div>
    )
  ]
}
export default meta
type Story = StoryObj<typeof SignInTemplate>

export const Default: Story = {
  args: {
    children: (
      <div className='flex flex-col gap-4'>
        <h1 className='text-xl font-bold'>Welcome back</h1>
        <div className='rounded-md border border-dashed p-6 text-center text-sm text-muted-foreground'>로그인 폼</div>
      </div>
    )
  }
}
