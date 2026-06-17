import type { Meta, StoryObj } from '@storybook/react'
import { CircleDashed } from 'lucide-react'
import { StatCard } from './StatCard'

/**
 * 대시보드 위쪽에 지표 하나를 보여주는 카드다. 왼쪽에 아이콘 박스가 있고 그 옆으로 작은 라벨,
 * 큼직한 수치, 그리고 짤막한 보조 설명이 따라온다. iconColor를 바꾸면 아이콘 박스의 글자색이 달라져서
 * 지표마다 강조 톤을 다르게 줄 수 있다.
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
      description: '지표 이름. 작은 글씨로 들어간다.',
      control: 'text',
      table: { type: { summary: 'string' } }
    },
    value: {
      description: '큰 글씨로 보이는 지표 값.',
      control: 'text',
      table: { type: { summary: 'string | number' } }
    },
    icon: {
      description: '왼쪽 박스에 들어갈 아이콘.',
      control: false,
      table: { type: { summary: 'ReactNode' } }
    },
    iconColor: {
      description: '아이콘 박스 글자색을 정하는 Tailwind 클래스.',
      control: 'text',
      table: { type: { summary: 'string' }, defaultValue: { summary: 'text-muted-foreground' } }
    },
    description: {
      description: '값 옆에 붙는 보조 설명. 없어도 된다.',
      control: 'text',
      table: { type: { summary: 'string' } }
    }
  }
}
export default meta
type Story = StoryObj<typeof StatCard>

/** 가장 평범한 지표 카드. */
export const Default: Story = {
  args: {
    title: 'Open issues',
    value: 24,
    icon: <CircleDashed size={18} />,
    description: 'this week'
  }
}

/** iconColor를 줘서 아이콘을 눈에 띄게 만든 카드. */
export const ColoredIcon: Story = {
  args: {
    title: 'Blocked',
    value: 3,
    icon: <CircleDashed size={18} />,
    iconColor: 'text-destructive',
    description: 'needs attention'
  }
}
