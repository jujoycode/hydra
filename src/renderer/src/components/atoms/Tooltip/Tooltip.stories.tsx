import type { Meta, StoryObj } from '@storybook/react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './Tooltip'

/**
 * 트리거에 마우스를 올리거나 포커스가 가면 짧은 설명을 띄우는 툴팁으로, Radix Tooltip 기반이다.
 * 트리거 역할인 TooltipTrigger와 말풍선인 TooltipContent를 짝지어 쓴다. 루트 Tooltip이 안에서
 * TooltipProvider를 감싸주니 단독으로도 동작하지만, 여러 툴팁이 delayDuration을 함께 쓰게 하려면
 * 상위에 TooltipProvider를 한 번 두는 편이 낫다. 뜨는 위치는 TooltipContent의 side와 sideOffset으로 잡는다.
 */
const meta: Meta<typeof Tooltip> = {
  title: 'Atoms/Tooltip',
  component: Tooltip,
  argTypes: {
    open: {
      description: '열고 닫는 걸 직접 쥐고 있을 때.',
      control: 'boolean',
      table: { type: { summary: 'boolean' } }
    },
    defaultOpen: {
      description: '처음 열려 있을지만 정하고 나머지는 맡긴다.',
      control: 'boolean',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } }
    },
    delayDuration: {
      description: '마우스를 올리고 툴팁이 뜨기까지 기다리는 시간. Provider 기본값은 0이다.',
      control: 'number',
      table: { type: { summary: 'number' }, defaultValue: { summary: '0' } }
    },
    onOpenChange: {
      description: '열리거나 닫힐 때마다 불린다.',
      control: false,
      table: { category: 'Events', type: { summary: '(open: boolean) => void' } }
    }
  }
}
export default meta
type Story = StoryObj<typeof Tooltip>

/** 트리거에 마우스를 올리면 말풍선이 뜨는 기본 모양. */
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

/** side를 줘서 툴팁을 트리거 오른쪽에 띄운 경우. */
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
