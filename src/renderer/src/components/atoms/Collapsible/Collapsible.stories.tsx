import type { Meta, StoryObj } from '@storybook/react'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './Collapsible'

/**
 * 트리거를 눌러 영역을 접었다 펼치는 컨테이너로, Radix Collapsible을 그대로 재노출한 것이다.
 * CollapsibleTrigger를 클릭하면 CollapsibleContent가 토글된다. 열림 상태를 제어하려면 open과
 * onOpenChange를 사용하고, 초기 상태만 지정하고 비제어로 두려면 defaultOpen을 전달한다. 스타일이
 * 없는 프리미티브이므로 모양은 className으로 직접 지정해야 한다.
 */
const meta: Meta<typeof Collapsible> = {
  title: 'Atoms/Collapsible',
  component: Collapsible,
  argTypes: {
    open: {
      description: '열림 상태를 직접 제어할 때 사용한다.',
      control: 'boolean',
      table: { type: { summary: 'boolean' } }
    },
    defaultOpen: {
      description: '초기 열림 여부만 지정하고 이후는 비제어로 둔다.',
      control: 'boolean',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } }
    },
    disabled: {
      description: '켜면 토글이 차단된다.',
      control: 'boolean',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } }
    },
    onOpenChange: {
      description: '열리거나 닫힐 때마다 호출된다.',
      control: false,
      table: { category: 'Events', type: { summary: '(open: boolean) => void' } }
    }
  }
}
export default meta
type Story = StoryObj<typeof Collapsible>

/** 접힌 상태로 시작해 트리거로 여닫는 기본 형태. */
export const Default: Story = {
  render: () => (
    <Collapsible className='w-80'>
      <CollapsibleTrigger className='rounded border px-3 py-1 text-sm'>토글</CollapsibleTrigger>
      <CollapsibleContent className='mt-2 text-sm text-muted-foreground'>접히는 영역의 내용입니다.</CollapsibleContent>
    </Collapsible>
  )
}

/** defaultOpen을 지정해 처음부터 펼쳐져 있는 경우. */
export const DefaultOpen: Story = {
  render: () => (
    <Collapsible defaultOpen className='w-80'>
      <CollapsibleTrigger className='rounded border px-3 py-1 text-sm'>토글</CollapsibleTrigger>
      <CollapsibleContent className='mt-2 text-sm text-muted-foreground'>처음부터 펼쳐져 있습니다.</CollapsibleContent>
    </Collapsible>
  )
}
