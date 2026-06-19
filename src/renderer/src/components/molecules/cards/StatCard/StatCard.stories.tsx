import type { Meta, StoryObj } from '@storybook/react'
import { CircleDashed } from 'lucide-react'
import { StatCard } from './StatCard'

/**
 * 대시보드 상단에 지표 하나를 표시하는 카드다. 왼쪽에 아이콘 박스가 있고 그 옆으로 작은 라벨,
 * 큰 수치, 짧은 보조 설명이 이어진다. iconColor로 아이콘 박스의 글자색을 바꿔
 * 지표마다 강조 톤을 다르게 지정할 수 있다.
 */
const meta: Meta<typeof StatCard> = {
  title: 'Molecules/StatCard',
  component: StatCard,
  decorators: [
    (Story) => (
      <div className='w-64'>
        <Story />
      </div>
    )
  ],
  argTypes: {
    title: {
      description: '지표 이름. 작은 글씨로 표시한다.',
      control: 'text',
      table: { type: { summary: 'string' } }
    },
    value: {
      description: '큰 글씨로 표시하는 지표 값.',
      control: 'text',
      table: { type: { summary: 'string | number' } }
    },
    icon: {
      description: '왼쪽 박스에 표시할 아이콘.',
      control: false,
      table: { type: { summary: 'ReactNode' } }
    },
    iconColor: {
      description: '아이콘 박스 글자색을 지정하는 Tailwind 클래스.',
      control: 'text',
      table: { type: { summary: 'string' }, defaultValue: { summary: 'text-muted-foreground' } }
    },
    description: {
      description: '값 옆에 표시하는 보조 설명. 선택 사항이다.',
      control: 'text',
      table: { type: { summary: 'string' } }
    }
  }
}
export default meta
type Story = StoryObj<typeof StatCard>

/** 가장 기본적인 지표 카드. */
export const Default: Story = {
  args: {
    title: 'Open issues',
    value: 24,
    icon: <CircleDashed size={18} />,
    description: 'this week'
  }
}

/** iconColor를 지정해 아이콘을 강조한 카드. */
export const ColoredIcon: Story = {
  args: {
    title: 'Blocked',
    value: 3,
    icon: <CircleDashed size={18} />,
    iconColor: 'text-destructive',
    description: 'needs attention'
  }
}
