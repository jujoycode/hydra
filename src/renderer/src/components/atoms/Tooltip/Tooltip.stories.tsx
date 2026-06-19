import type { Meta, StoryObj } from '@storybook/react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './Tooltip'

/**
 * 트리거에 마우스를 올리거나 포커스가 가면 짧은 설명을 표시하는 툴팁으로, Radix Tooltip 기반이다.
 * 트리거 역할인 TooltipTrigger와 말풍선인 TooltipContent를 짝지어 사용한다. 루트 Tooltip이 내부에서
 * TooltipProvider를 감싸므로 단독으로도 동작하지만, 여러 툴팁이 delayDuration을 공유하게 하려면 상위에
 * TooltipProvider를 한 번 두는 편이 좋다. 표시 위치는 TooltipContent의 side와 sideOffset으로 지정한다.
 */
const meta: Meta<typeof Tooltip> = {
  title: 'Atoms/Tooltip',
  component: Tooltip,
  argTypes: {
    open: {
      description: '열고 닫는 상태를 직접 제어할 때 사용한다.',
      control: 'boolean',
      table: { type: { summary: 'boolean' } }
    },
    defaultOpen: {
      description: '초기 열림 여부만 지정하고 이후는 비제어로 둔다.',
      control: 'boolean',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } }
    },
    delayDuration: {
      description: '마우스를 올린 뒤 툴팁이 표시되기까지의 지연 시간. Provider 기본값은 0이다.',
      control: 'number',
      table: { type: { summary: 'number' }, defaultValue: { summary: '0' } }
    },
    onOpenChange: {
      description: '열리거나 닫힐 때마다 호출된다.',
      control: false,
      table: { category: 'Events', type: { summary: '(open: boolean) => void' } }
    }
  }
}
export default meta
type Story = StoryObj<typeof Tooltip>

/** 트리거에 마우스를 올리면 말풍선이 표시되는 기본 형태. */
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

/** side를 지정해 툴팁을 트리거 오른쪽에 표시한 경우. */
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
