import type { Meta, StoryObj } from '@storybook/react'
import { ChartCard } from './ChartCard'

/**
 * 대시보드 차트를 담는 glass-soft 카드다. 위에는 제목이, 필요하면 설명까지 붙은 헤더가 오고
 * 그 아래 children 자리에 Recharts 같은 차트를 넣는다. 카드 배경은 비쳐 보이게 투명하다.
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
      description: '카드 헤더에 들어가는 제목.',
      control: 'text',
      table: { type: { summary: 'string' } }
    },
    description: {
      description: '제목 밑에 한 줄 덧붙이는 설명. 없어도 된다.',
      control: 'text',
      table: { type: { summary: 'string' } }
    },
    children: {
      description: '본문에 그릴 차트나 콘텐츠.',
      control: false,
      table: { type: { summary: 'ReactNode' } }
    }
  }
}
export default meta
type Story = StoryObj<typeof ChartCard>

/** 제목과 설명을 다 갖추고 자리만 잡아둔 차트 영역. */
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

/** 설명은 빼고 제목만 둔 카드. */
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
