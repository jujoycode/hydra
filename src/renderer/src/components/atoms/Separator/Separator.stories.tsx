import type { Meta, StoryObj } from '@storybook/react'
import { Separator } from './Separator'

const meta: Meta<typeof Separator> = {
  title: 'Atoms/Separator',
  component: Separator
}
export default meta
type Story = StoryObj<typeof Separator>

export const Horizontal: Story = {
  render: () => (
    <div className='w-64'>
      <p className='text-sm'>위</p>
      <Separator className='my-2' />
      <p className='text-sm'>아래</p>
    </div>
  )
}
