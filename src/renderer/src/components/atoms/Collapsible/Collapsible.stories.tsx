import type { Meta, StoryObj } from '@storybook/react'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './Collapsible'

/**
 * 트리거를 눌러 영역을 접었다 펼치는 컨테이너로, Radix Collapsible을 그대로 다시 내보낸 것이다.
 * CollapsibleTrigger를 클릭하면 CollapsibleContent가 토글된다. 열고 닫는 걸 직접 쥐려면 open과
 * onOpenChange를 쓰고, 처음 상태만 정해두고 나머지를 맡기려면 defaultOpen만 넘기면 된다. 스타일이
 * 없는 프리미티브라 모양은 className으로 직접 입혀야 한다.
 */
const meta: Meta<typeof Collapsible> = {
  title: 'Atoms/Collapsible',
  component: Collapsible,
  argTypes: {
    open: {
      description: '열림 상태를 직접 쥐고 흔들 때.',
      control: 'boolean',
      table: { type: { summary: 'boolean' } }
    },
    defaultOpen: {
      description: '처음 열려 있을지만 정하고 나머지는 맡긴다.',
      control: 'boolean',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } }
    },
    disabled: {
      description: '켜면 토글이 막힌다.',
      control: 'boolean',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } }
    },
    onOpenChange: {
      description: '열리거나 닫힐 때마다 불린다.',
      control: false,
      table: { category: 'Events', type: { summary: '(open: boolean) => void' } }
    }
  }
}
export default meta
type Story = StoryObj<typeof Collapsible>

/** 접힌 채로 시작해 트리거로 여닫는 기본 모양. */
export const Default: Story = {
  render: () => (
    <Collapsible className='w-80'>
      <CollapsibleTrigger className='rounded border px-3 py-1 text-sm'>토글</CollapsibleTrigger>
      <CollapsibleContent className='mt-2 text-sm text-muted-foreground'>접히는 영역의 내용입니다.</CollapsibleContent>
    </Collapsible>
  )
}

/** defaultOpen을 줘서 처음부터 펼쳐져 있는 경우. */
export const DefaultOpen: Story = {
  render: () => (
    <Collapsible defaultOpen className='w-80'>
      <CollapsibleTrigger className='rounded border px-3 py-1 text-sm'>토글</CollapsibleTrigger>
      <CollapsibleContent className='mt-2 text-sm text-muted-foreground'>처음부터 펼쳐져 있습니다.</CollapsibleContent>
    </Collapsible>
  )
}
