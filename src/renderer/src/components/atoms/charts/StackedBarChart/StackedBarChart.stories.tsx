import type { Meta, StoryObj } from '@storybook/react'
import { StackedBarChart } from './StackedBarChart'

/**
 * 여러 시리즈를 같은 stackId로 쌓아 누적 막대로 보여준다. 스프린트별 done/in-progress처럼
 * 부분 합과 전체 합을 함께 비교할 때 사용한다. layout으로 가로(vertical)/세로(horizontal)
 * 막대를 전환할 수 있고, 각 막대는 bars 설정으로 dataKey·색상·모서리 반경을 지정한다.
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
      description: '막대 데이터 배열. 각 항목은 축 라벨 { name } + bars의 dataKey에 대응하는 숫자 필드.',
      control: 'object',
      table: { type: { summary: 'Array<{ name: string; [key: string]: string | number }>' } }
    },
    bars: {
      description:
        '쌓을 막대 시리즈 정의. 각 항목은 { dataKey, stackId, fill, radius? }. 같은 stackId끼리 누적되며 fill은 CSS 변수 권장.',
      control: 'object',
      table: {
        type: {
          summary:
            'Array<{ dataKey: string; stackId: string; fill: string; radius?: [number, number, number, number] }>'
        }
      }
    },
    layout: {
      description: '막대 방향. vertical은 가로 막대, horizontal은 세로 막대.',
      control: 'inline-radio',
      options: ['vertical', 'horizontal'],
      table: { type: { summary: "'vertical' | 'horizontal'" }, defaultValue: { summary: "'vertical'" } }
    },
    height: {
      description: '차트 높이(px).',
      control: { type: 'number' },
      table: { type: { summary: 'number' }, defaultValue: { summary: '200' } }
    },
    yAxisWidth: {
      description: 'Y축(라벨) 영역 너비(px). vertical 레이아웃에서 의미 있다.',
      control: { type: 'number' },
      table: { type: { summary: 'number' }, defaultValue: { summary: '80' } }
    },
    barSize: {
      description: '막대 두께(px).',
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

/** 스프린트별 done/in-progress 누적 막대 기본 예시(가로 막대). */
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

/** 세로 막대(horizontal) 레이아웃 예시. */
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

/** 데이터가 비어 있을 때. 축과 범례만 그려지고 막대는 표시되지 않는다. */
export const Empty: Story = {
  args: {
    data: [],
    bars: [
      { dataKey: 'done', stackId: 's', fill: 'var(--chart-1)' },
      { dataKey: 'inProgress', stackId: 's', fill: 'var(--chart-2)' }
    ]
  }
}
