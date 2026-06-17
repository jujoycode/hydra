import type { Meta, StoryObj } from '@storybook/react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './Tabs'

/**
 * 한 자리에서 여러 패널을 전환하는 탭으로, Radix Tabs 기반의 합성 컴포넌트다. 탭 버튼은 TabsList 안에
 * TabsTrigger를 넣어 구성하고, 각 버튼의 value와 같은 value를 가진 TabsContent가 해당 패널이 된다.
 * 활성 탭은 루트 Tabs에서 정하며, 초기 값만 지정하려면 defaultValue를, 직접 제어하려면 value와
 * onValueChange를 사용한다. 활성 트리거는 bg-background에 그림자가 더해져 두드러진다.
 */
const meta: Meta<typeof Tabs> = {
  title: 'Atoms/Tabs',
  component: Tabs,
  argTypes: {
    defaultValue: {
      description: '초기 활성 탭의 value만 지정하고 이후는 비제어로 둔다.',
      control: 'text',
      table: { type: { summary: 'string' } }
    },
    value: {
      description: '활성 탭을 직접 제어할 때의 value.',
      control: 'text',
      table: { type: { summary: 'string' } }
    },
    orientation: {
      description: '탭이 배치되는 방향. 방향키로 이동하는 축도 이를 따른다.',
      control: 'inline-radio',
      options: ['horizontal', 'vertical'],
      table: { type: { summary: 'horizontal | vertical' }, defaultValue: { summary: 'horizontal' } }
    },
    onValueChange: {
      description: '다른 탭으로 바뀔 때마다 호출된다.',
      control: false,
      table: { category: 'Events', type: { summary: '(value: string) => void' } }
    }
  }
}
export default meta
type Story = StoryObj<typeof Tabs>

/** 탭 두 개를 오가는 기본 형태. */
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

/** 탭이 셋 이상이고 그중 하나가 disabled로 비활성화된 경우. */
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
