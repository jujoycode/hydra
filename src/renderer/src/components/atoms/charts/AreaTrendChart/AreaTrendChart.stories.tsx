import type { Meta, StoryObj } from '@storybook/react'
import { AreaTrendChart } from './AreaTrendChart'

/**
 * 시간 흐름을 그라데이션 면적으로 깔아 추세를 보여주는 차트다. 시리즈를 여러 개 겹칠 수 있어서
 * 생성 이슈와 완료 이슈를 나란히 비교하는 식으로 쓴다. X축은 데이터의 name 키를 그대로 쓰고, 어떤
 * 값을 무슨 색과 그라데이션으로 그릴지는 lines에서 시리즈별로 잡는다.
 */
const meta: Meta<typeof AreaTrendChart> = {
  title: 'Atoms/Charts/AreaTrendChart',
  component: AreaTrendChart,
  decorators: [
    (Story) => (
      <div className='w-[480px]'>
        <Story />
      </div>
    )
  ],
  argTypes: {
    data: {
      description: '시계열 데이터. 항목마다 X축 라벨이 될 name과, lines의 dataKey가 가리키는 숫자 필드를 담는다.',
      control: 'object',
      table: { type: { summary: 'Array<{ name: string; [key: string]: string | number }>' } }
    },
    lines: {
      description:
        '그릴 면적 시리즈들. 항목은 dataKey와 name, color, gradientId로 이뤄진다. color는 CSS 변수를 쓰는 게 좋고 gradientId는 시리즈마다 달라야 한다.',
      control: 'object',
      table: {
        type: { summary: 'Array<{ dataKey: string; name?: string; color: string; gradientId: string }>' }
      }
    },
    height: {
      description: '차트 높이.',
      control: { type: 'number' },
      table: { type: { summary: 'number' }, defaultValue: { summary: '200' } }
    }
  }
}
export default meta
type Story = StoryObj<typeof AreaTrendChart>

/** 생성과 완료 두 시리즈를 겹쳐 둔 기본 모양. */
export const Default: Story = {
  args: {
    data: [
      { name: 'Mon', created: 4, closed: 2 },
      { name: 'Tue', created: 6, closed: 5 },
      { name: 'Wed', created: 3, closed: 4 },
      { name: 'Thu', created: 8, closed: 6 },
      { name: 'Fri', created: 5, closed: 7 }
    ],
    lines: [
      { dataKey: 'created', name: 'Created', color: 'var(--chart-1)', gradientId: 'g-created' },
      { dataKey: 'closed', name: 'Closed', color: 'var(--chart-2)', gradientId: 'g-closed' }
    ]
  }
}

/** 시리즈가 하나뿐일 때. */
export const SingleLine: Story = {
  args: {
    data: [
      { name: 'Week 1', velocity: 12 },
      { name: 'Week 2', velocity: 18 },
      { name: 'Week 3', velocity: 15 },
      { name: 'Week 4', velocity: 22 }
    ],
    lines: [{ dataKey: 'velocity', name: 'Velocity', color: 'var(--chart-3)', gradientId: 'g-velocity' }]
  }
}

/** 데이터가 없으면 축만 남고 면적은 안 그려진다. */
export const Empty: Story = {
  args: {
    data: [],
    lines: [{ dataKey: 'created', name: 'Created', color: 'var(--chart-1)', gradientId: 'g-empty' }]
  }
}
