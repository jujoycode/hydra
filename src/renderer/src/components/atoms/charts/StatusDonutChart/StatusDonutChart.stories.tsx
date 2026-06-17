import type { Meta, StoryObj } from '@storybook/react'
import { StatusDonutChart } from './StatusDonutChart'

/**
 * 상태별 이슈 분포를 도넛으로 보여준다. 조각 색은 데이터에 직접 적어 넣고, 가운데가 뚫려 있어서
 * 그 자리에 범례나 합계 텍스트를 얹기 좋다. 프로젝트 대시보드에서 Backlog, In Progress, Done 같은
 * 상태 비중을 한눈에 견주는 데 쓴다.
 */
const meta: Meta<typeof StatusDonutChart> = {
  title: 'Atoms/Charts/StatusDonutChart',
  component: StatusDonutChart,
  decorators: [
    (Story) => (
      <div className='w-96'>
        <Story />
      </div>
    )
  ],
  argTypes: {
    data: {
      description:
        '도넛 조각들. 항목은 name과 value, color로 이뤄지고 color는 var(--chart-1) 같은 CSS 변수를 쓰는 게 좋다.',
      control: 'object',
      table: { type: { summary: 'Array<{ name: string; value: number; color: string }>' } }
    },
    height: {
      description: '차트 높이. 안쪽과 바깥쪽 반지름이 이 값에 비례해 잡힌다.',
      control: { type: 'number' },
      table: { type: { summary: 'number' }, defaultValue: { summary: '200' } }
    },
    showLabels: {
      description: '조각마다 백분율 라벨을 띄울지 여부.',
      control: 'boolean',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'true' } }
    }
  }
}
export default meta
type Story = StoryObj<typeof StatusDonutChart>

/** 상태 분포를 보여주는 기본 모양. */
export const Default: Story = {
  args: {
    data: [
      { name: 'Backlog', value: 8, color: 'var(--chart-1)' },
      { name: 'In Progress', value: 5, color: 'var(--chart-2)' },
      { name: 'Review', value: 3, color: 'var(--chart-3)' },
      { name: 'Done', value: 12, color: 'var(--chart-4)' }
    ]
  }
}

/** 백분율 라벨을 끈 모양. 범례를 바깥에 따로 둘 때 쓴다. */
export const WithoutLabels: Story = {
  args: {
    data: [
      { name: 'Backlog', value: 8, color: 'var(--chart-1)' },
      { name: 'In Progress', value: 5, color: 'var(--chart-2)' },
      { name: 'Done', value: 12, color: 'var(--chart-4)' }
    ],
    showLabels: false
  }
}

/** 데이터가 없으면 조각 없이 빈 도넛 자리만 남는다. */
export const Empty: Story = {
  args: {
    data: []
  }
}
