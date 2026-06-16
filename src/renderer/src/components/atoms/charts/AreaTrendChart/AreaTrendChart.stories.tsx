import type { Meta, StoryObj } from '@storybook/react'
import { AreaTrendChart } from './AreaTrendChart'

/**
 * 시간 흐름에 따른 추세를 그라데이션 면적 차트로 보여준다. 여러 시리즈를 겹쳐 그릴 수 있어
 * 생성/완료 이슈처럼 둘 이상의 추세를 비교할 때 적합하다. X축은 데이터의 `name` 키를 사용하고,
 * 각 시리즈는 `lines`로 dataKey·색상·그라데이션 id를 지정한다.
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
      description: '시계열 데이터 배열. 각 항목은 X축 라벨이 되는 { name } + lines의 dataKey에 대응하는 숫자 필드.',
      control: 'object',
      table: { type: { summary: 'Array<{ name: string; [key: string]: string | number }>' } }
    },
    lines: {
      description:
        '그릴 면적 시리즈 정의. 각 항목은 { dataKey, name?, color, gradientId }. color는 CSS 변수 권장, gradientId는 시리즈마다 고유해야 한다.',
      control: 'object',
      table: {
        type: { summary: 'Array<{ dataKey: string; name?: string; color: string; gradientId: string }>' }
      }
    },
    height: {
      description: '차트 높이(px).',
      control: { type: 'number' },
      table: { type: { summary: 'number' }, defaultValue: { summary: '200' } }
    }
  }
}
export default meta
type Story = StoryObj<typeof AreaTrendChart>

/** 생성/완료 두 시리즈를 겹쳐 보여주는 기본 예시. */
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

/** 시리즈가 하나뿐인 단일 추세 예시. */
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

/** 데이터가 비어 있을 때. 축만 그려지고 면적은 표시되지 않는다. */
export const Empty: Story = {
  args: {
    data: [],
    lines: [{ dataKey: 'created', name: 'Created', color: 'var(--chart-1)', gradientId: 'g-empty' }]
  }
}
