import type { Meta, StoryObj } from '@storybook/react'
import { StackedBarChart } from './StackedBarChart'

/**
 * 같은 stackId를 가진 시리즈들을 위로 쌓아 누적 막대로 보여준다. 스프린트마다 done과 in-progress를
 * 한 막대에 쌓아 부분 합과 전체 합을 같이 보는 식으로 쓴다. layout을 vertical로 두면 막대가 가로로,
 * horizontal로 두면 세로로 눕고, 막대별 dataKey와 색, 모서리 반경은 bars에서 잡는다.
 */
const meta: Meta<typeof StackedBarChart> = {
  title: 'Atoms/Charts/StackedBarChart',
  component: StackedBarChart,
  decorators: [
    (Story) => (
      <div className='w-[480px]'>
        <Story />
      </div>
    )
  ],
  argTypes: {
    data: {
      description: '막대 데이터. 항목마다 축 라벨이 될 name과, bars의 dataKey가 가리키는 숫자 필드를 담는다.',
      control: 'object',
      table: { type: { summary: 'Array<{ name: string; [key: string]: string | number }>' } }
    },
    bars: {
      description:
        '쌓을 막대 시리즈들. 항목은 dataKey와 stackId, fill로 이뤄지고 radius는 선택이다. stackId가 같은 것끼리 누적되며 fill은 CSS 변수를 쓰는 게 좋다.',
      control: 'object',
      table: {
        type: {
          summary:
            'Array<{ dataKey: string; stackId: string; fill: string; radius?: [number, number, number, number] }>'
        }
      }
    },
    layout: {
      description: '막대 방향. vertical이면 가로로 눕고 horizontal이면 세로로 선다.',
      control: 'inline-radio',
      options: ['vertical', 'horizontal'],
      table: { type: { summary: "'vertical' | 'horizontal'" }, defaultValue: { summary: "'vertical'" } }
    },
    height: {
      description: '차트 높이.',
      control: { type: 'number' },
      table: { type: { summary: 'number' }, defaultValue: { summary: '200' } }
    },
    yAxisWidth: {
      description: '라벨이 들어가는 Y축 영역 너비. vertical 레이아웃에서만 의미가 있다.',
      control: { type: 'number' },
      table: { type: { summary: 'number' }, defaultValue: { summary: '80' } }
    },
    barSize: {
      description: '막대 두께.',
      control: { type: 'number' },
      table: { type: { summary: 'number' }, defaultValue: { summary: '14' } }
    },
    margin: {
      description: '차트 여백.',
      control: 'object',
      table: {
        type: { summary: '{ top: number; right: number; bottom: number; left: number }' },
        defaultValue: { summary: '{ top: 10, right: 10, bottom: 10, left: 80 }' }
      }
    }
  }
}
export default meta
type Story = StoryObj<typeof StackedBarChart>

/** 스프린트별 done과 in-progress를 쌓은 기본 모양, 가로 막대다. */
export const Default: Story = {
  args: {
    data: [
      { name: 'Sprint 1', done: 8, inProgress: 3 },
      { name: 'Sprint 2', done: 12, inProgress: 5 },
      { name: 'Sprint 3', done: 6, inProgress: 7 }
    ],
    bars: [
      { dataKey: 'done', stackId: 's', fill: 'var(--chart-1)' },
      { dataKey: 'inProgress', stackId: 's', fill: 'var(--chart-2)' }
    ]
  }
}

/** layout을 horizontal로 둬서 막대를 세로로 세운 경우. */
export const Horizontal: Story = {
  args: {
    layout: 'horizontal',
    data: [
      { name: 'Sprint 1', done: 8, inProgress: 3 },
      { name: 'Sprint 2', done: 12, inProgress: 5 },
      { name: 'Sprint 3', done: 6, inProgress: 7 }
    ],
    bars: [
      { dataKey: 'done', stackId: 's', fill: 'var(--chart-1)' },
      { dataKey: 'inProgress', stackId: 's', fill: 'var(--chart-2)' }
    ]
  }
}

/** 데이터가 없으면 축과 범례만 남고 막대는 안 그려진다. */
export const Empty: Story = {
  args: {
    data: [],
    bars: [
      { dataKey: 'done', stackId: 's', fill: 'var(--chart-1)' },
      { dataKey: 'inProgress', stackId: 's', fill: 'var(--chart-2)' }
    ]
  }
}
