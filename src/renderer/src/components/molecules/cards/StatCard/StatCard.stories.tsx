import type { Meta, StoryObj } from '@storybook/react'
import { CircleDashed } from 'lucide-react'
import { StatCard } from './StatCard'

/**
 * 대시보드 상단의 단일 지표 카드. 좌측 아이콘 박스 + (라벨 / 큰 수치 + 보조 설명)으로 구성한다.
 * `iconColor`로 아이콘 박스의 텍스트 색을 바꿔 지표별 강조 톤을 지정할 수 있다.
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
      description: '지표 라벨(작은 글씨)',
      control: 'text',
      table: { type: { summary: 'string' } }
    },
    value: {
      description: '큰 글씨로 표시되는 지표 값',
      control: 'text',
      table: { type: { summary: 'string | number' } }
    },
    icon: {
      description: '좌측 아이콘 박스에 들어가는 아이콘(ReactNode)',
      control: false,
      table: { type: { summary: 'ReactNode' } }
    },
    iconColor: {
      description: '아이콘 박스의 텍스트 색상 Tailwind 클래스',
      control: 'text',
      table: { type: { summary: 'string' }, defaultValue: { summary: 'text-muted-foreground' } }
    },
    description: {
      description: '값 옆에 표시되는 보조 설명(선택)',
      control: 'text',
      table: { type: { summary: 'string' } }
    }
  }
}
export default meta
type Story = StoryObj<typeof StatCard>

/** 기본 지표 카드. */
export const Default: Story = {
  args: {
    title: 'Open issues',
    value: 24,
    icon: <CircleDashed size={18} />,
    description: 'this week'
  }
}

/** iconColor로 아이콘 톤을 강조한 카드. */
export const ColoredIcon: Story = {
  args: {
    title: 'Blocked',
    value: 3,
    icon: <CircleDashed size={18} />,
    iconColor: 'text-destructive',
    description: 'needs attention'
  }
}
