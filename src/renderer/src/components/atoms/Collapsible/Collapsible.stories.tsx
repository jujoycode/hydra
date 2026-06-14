import type { Meta, StoryObj } from '@storybook/react'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './Collapsible'

const meta: Meta<typeof Collapsible> = { title: 'Atoms/Collapsible', component: Collapsible }
export default meta
type Story = StoryObj<typeof Collapsible>

export const Default: Story = {
  render: () => (
    <Collapsible className='w-80'>
      <CollapsibleTrigger className='rounded border px-3 py-1 text-sm'>토글</CollapsibleTrigger>
      <CollapsibleContent className='mt-2 text-sm text-muted-foreground'>접히는 영역의 내용입니다.</CollapsibleContent>
    </Collapsible>
  )
}
