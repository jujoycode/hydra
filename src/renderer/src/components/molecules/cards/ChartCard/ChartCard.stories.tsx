import type { Meta, StoryObj } from '@storybook/react'
import { ChartCard } from './ChartCard'

/**
 * 대시보드 차트를 감싸는 유리 효과(glass-soft) 카드. 제목 + 선택적 설명 헤더 아래
 * children 영역에 Recharts 등 차트를 배치한다. 카드 배경은 투명 처리되어 있다.
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
      description: '카드 헤더에 표시되는 제목',
      control: 'text',
      table: { type: { summary: 'string' } }
    },
    description: {
      description: '제목 아래에 표시되는 보조 설명(선택)',
      control: 'text',
      table: { type: { summary: 'string' } }
    },
    children: {
      description: '본문에 렌더되는 차트/콘텐츠(ReactNode)',
      control: false,
      table: { type: { summary: 'ReactNode' } }
    }
  }
}
export default meta
type Story = StoryObj<typeof ChartCard>

/** 제목 + 설명 + 플레이스홀더 차트 영역. */
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

/** 설명 없이 제목만 있는 카드. */
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
