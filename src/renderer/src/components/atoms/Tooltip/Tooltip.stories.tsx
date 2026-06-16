import type { Meta, StoryObj } from '@storybook/react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './Tooltip'

/**
 * 트리거에 호버/포커스하면 짧은 보조 설명을 띄우는 툴팁. Radix Tooltip 기반이다.
 *
 * - `TooltipTrigger`(트리거 요소) + `TooltipContent`(말풍선)로 구성한다.
 * - 루트 `Tooltip`이 자체 `TooltipProvider`를 감싸므로 단독 사용이 가능하지만,
 *   `delayDuration`을 공유하려면 상위에 `TooltipProvider`를 두는 것이 좋다(기본 delay 0).
 * - `TooltipContent`의 `side`/`sideOffset`로 위치를 조정한다.
 */
const meta: Meta<typeof Tooltip> = {
  title: 'Atoms/Tooltip',
  component: Tooltip,
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
    delayDuration: {
      description: '호버 후 툴팁이 뜨기까지의 지연(ms). Provider 기본은 0이다.',
      control: 'number',
      table: { type: { summary: 'number' }, defaultValue: { summary: '0' } }
    },
    onOpenChange: {
      description: '열림 상태 변경 콜백.',
      control: false,
      table: { category: 'Events', type: { summary: '(open: boolean) => void' } }
    }
  }
}
export default meta
type Story = StoryObj<typeof Tooltip>

/** 트리거에 호버하면 말풍선이 뜨는 기본 예시. */
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

/** side로 툴팁이 트리거 오른쪽에 뜨도록 한 예. */
export const SidePlacement: Story = {
  render: () => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger className='rounded border px-3 py-1 text-sm'>오른쪽 툴팁</TooltipTrigger>
        <TooltipContent side='right'>오른쪽에 표시됩니다</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
