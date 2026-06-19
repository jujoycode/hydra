import type { Meta, StoryObj } from '@storybook/react'
import { ChartCard } from './ChartCard'

/**
 * 대시보드 차트를 담는 glass-soft 카드다. 상단에는 제목과 선택적 설명으로 구성한 헤더가 오고,
 * 그 아래 children 영역에 Recharts 같은 차트를 배치한다. 카드 배경은 반투명하다.
 */
const meta: Meta<typeof ChartCard> = {
  title: 'Molecules/ChartCard',
  component: ChartCard,
  decorators: [
    (Story) => (
      <div className='w-[480px]'>
        <Story />
      </div>
    )
  ],
  argTypes: {
    title: {
      description: '카드 헤더에 표시하는 제목.',
      control: 'text',
      table: { type: { summary: 'string' } }
    },
    description: {
      description: '제목 아래에 한 줄로 표시하는 설명. 선택 사항이다.',
      control: 'text',
      table: { type: { summary: 'string' } }
    },
    children: {
      description: '본문에 표시할 차트나 콘텐츠.',
      control: false,
      table: { type: { summary: 'ReactNode' } }
    }
  }
}
export default meta
type Story = StoryObj<typeof ChartCard>

/** 제목과 설명을 모두 갖춘 차트 영역. */
export const Default: Story = {
  args: {
    title: 'Issues by status',
    description: '현재 스프린트 기준',
    children: (
      <div className='flex h-40 items-center justify-center rounded-md bg-muted text-sm text-muted-foreground'>
        차트 영역
      </div>
    )
  }
}

/** 설명 없이 제목만 둔 카드. */
export const WithoutDescription: Story = {
  args: {
    title: 'Throughput',
    children: (
      <div className='flex h-40 items-center justify-center rounded-md bg-muted text-sm text-muted-foreground'>
        차트 영역
      </div>
    )
  }
}
