import type { Meta, StoryObj } from '@storybook/react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './Tabs'

/**
 * 같은 영역에서 여러 패널을 전환하는 탭. Radix Tabs 기반의 합성 컴포넌트다.
 *
 * - `TabsList`/`TabsTrigger`(value)로 탭 버튼을, `TabsContent`(value)로 패널을 정의한다.
 * - 루트 `Tabs`는 `defaultValue`(비제어) 또는 `value`/`onValueChange`(제어)로 활성 탭을 정한다.
 * - 활성 트리거는 `bg-background` + 그림자로 강조된다.
 */
const meta: Meta<typeof Tabs> = {
  title: 'Atoms/Tabs',
  component: Tabs,
  argTypes: {
    defaultValue: {
      description: '비제어형 초기 활성 탭 value.',
      control: 'text',
      table: { type: { summary: 'string' } }
    },
    value: {
      description: '제어형 활성 탭 value.',
      control: 'text',
      table: { type: { summary: 'string' } }
    },
    orientation: {
      description: '탭 배치 방향. 키보드 내비게이션 축에 영향을 준다.',
      control: 'inline-radio',
      options: ['horizontal', 'vertical'],
      table: { type: { summary: 'horizontal | vertical' }, defaultValue: { summary: 'horizontal' } }
    },
    onValueChange: {
      description: '활성 탭 변경 콜백.',
      control: false,
      table: { category: 'Events', type: { summary: '(value: string) => void' } }
    }
  }
}
export default meta
type Story = StoryObj<typeof Tabs>

/** 두 개의 탭을 전환하는 기본 예시. */
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

/** 세 개 이상의 탭과 비활성(disabled) 트리거를 포함한 예. */
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
