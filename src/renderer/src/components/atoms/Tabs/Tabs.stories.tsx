import type { Meta, StoryObj } from '@storybook/react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './Tabs'

const meta: Meta<typeof Tabs> = { title: 'Atoms/Tabs', component: Tabs }
export default meta
type Story = StoryObj<typeof Tabs>

export const Default: Story = {
  render: () => (
    <Tabs defaultValue='overview' className='w-80'>
      <TabsList>
        <TabsTrigger value='overview'>개요</TabsTrigger>
        <TabsTrigger value='activity'>활동</TabsTrigger>
      </TabsList>
      <TabsContent value='overview'>개요 내용</TabsContent>
      <TabsContent value='activity'>활동 내용</TabsContent>
    </Tabs>
  )
}
