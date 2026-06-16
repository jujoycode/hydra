import type { Meta, StoryObj } from '@storybook/react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './Tabs'

/**
 * 한 자리에서 여러 패널을 갈아 끼우는 탭으로, Radix Tabs 기반의 합성 컴포넌트다. 탭 버튼은 TabsList
 * 안에 TabsTrigger를 넣어 만들고, 각 버튼의 value와 같은 value를 가진 TabsContent가 그 패널이 된다.
 * 어느 탭이 켜질지는 루트 Tabs에서 정하는데, 처음 값만 던지려면 defaultValue를, 직접 쥐려면 value와
 * onValueChange를 쓴다. 켜진 트리거는 bg-background에 그림자가 붙어 도드라진다.
 */
const meta: Meta<typeof Tabs> = {
  title: 'Atoms/Tabs',
  component: Tabs,
  argTypes: {
    defaultValue: {
      description: '처음 켜둘 탭의 value만 정하고 나머지는 맡긴다.',
      control: 'text',
      table: { type: { summary: 'string' } }
    },
    value: {
      description: '활성 탭을 직접 쥐고 있을 때의 value.',
      control: 'text',
      table: { type: { summary: 'string' } }
    },
    orientation: {
      description: '탭이 늘어서는 방향. 방향키로 이동하는 축도 여기 따라간다.',
      control: 'inline-radio',
      options: ['horizontal', 'vertical'],
      table: { type: { summary: 'horizontal | vertical' }, defaultValue: { summary: 'horizontal' } }
    },
    onValueChange: {
      description: '다른 탭으로 바뀔 때마다 불린다.',
      control: false,
      table: { category: 'Events', type: { summary: '(value: string) => void' } }
    }
  }
}
export default meta
type Story = StoryObj<typeof Tabs>

/** 탭 두 개를 오가는 기본 모양. */
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

/** 탭이 셋 이상이고 그중 하나는 disabled로 잠긴 경우. */
export const ManyTabs: Story = {
  render: () => (
    <Tabs defaultValue='issues' className='w-96'>
      <TabsList>
        <TabsTrigger value='issues'>이슈</TabsTrigger>
        <TabsTrigger value='tasks'>태스크</TabsTrigger>
        <TabsTrigger value='archived' disabled>
          보관됨
        </TabsTrigger>
      </TabsList>
      <TabsContent value='issues'>이슈 목록</TabsContent>
      <TabsContent value='tasks'>태스크 목록</TabsContent>
      <TabsContent value='archived'>보관된 항목</TabsContent>
    </Tabs>
  )
}
