import type { Meta, StoryObj } from '@storybook/react'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './Collapsible'

/**
 * 트리거를 눌러 영역을 펼치거나 접는 접이식 컨테이너. Radix Collapsible을 그대로 재노출한다.
 *
 * - `CollapsibleTrigger`를 클릭하면 `CollapsibleContent`가 토글된다.
 * - `open`/`onOpenChange`로 제어하거나 `defaultOpen`으로 초기 상태만 지정한다.
 * - 스타일이 없는 비스타일 프리미티브라 className으로 직접 꾸민다.
 */
const meta: Meta<typeof Collapsible> = {
  title: 'Atoms/Collapsible',
  component: Collapsible,
  argTypes: {
    open: {
      description: '제어형 열림 상태.',
      control: 'boolean',
      table: { type: { summary: 'boolean' } }
    },
    defaultOpen: {
      description: '비제어형 초기 열림 상태.',
      control: 'boolean',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } }
    },
    disabled: {
      description: 'true면 토글을 막는다.',
      control: 'boolean',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } }
    },
    onOpenChange: {
      description: '열림 상태 변경 콜백.',
      control: false,
      table: { category: 'Events', type: { summary: '(open: boolean) => void' } }
    }
  }
}
export default meta
type Story = StoryObj<typeof Collapsible>

/** 기본 접힘 상태에서 트리거로 토글한다. */
export const Default: Story = {
  render: () => (
    <Collapsible className='w-80'>
      <CollapsibleTrigger className='rounded border px-3 py-1 text-sm'>토글</CollapsibleTrigger>
      <CollapsibleContent className='mt-2 text-sm text-muted-foreground'>접히는 영역의 내용입니다.</CollapsibleContent>
    </Collapsible>
  )
}

/** defaultOpen으로 처음부터 펼쳐진 상태. */
export const DefaultOpen: Story = {
  render: () => (
    <Collapsible defaultOpen className='w-80'>
      <CollapsibleTrigger className='rounded border px-3 py-1 text-sm'>토글</CollapsibleTrigger>
      <CollapsibleContent className='mt-2 text-sm text-muted-foreground'>처음부터 펼쳐져 있습니다.</CollapsibleContent>
    </Collapsible>
  )
}
