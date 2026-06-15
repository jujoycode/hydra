import type { Meta, StoryObj } from '@storybook/react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './Tooltip'

const meta: Meta<typeof Tooltip> = { title: 'Atoms/Tooltip', component: Tooltip }
export default meta
type Story = StoryObj<typeof Tooltip>

export const Default: Story = {
  render: () => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger className='rounded border px-3 py-1 text-sm'>호버하세요</TooltipTrigger>
        <TooltipContent>툴팁 내용</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
