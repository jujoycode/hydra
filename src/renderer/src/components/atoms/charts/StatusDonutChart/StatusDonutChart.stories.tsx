import type { Meta, StoryObj } from '@storybook/react'
import { StatusDonutChart } from './StatusDonutChart'

/**
 * 상태별 이슈 분포를 도넛 차트로 보여준다. 각 조각의 색상은 데이터가 직접 지정하며,
 * 가운데가 비어 있어 범례나 합계 텍스트를 함께 배치하기 좋다.
 * 프로젝트 대시보드에서 Backlog/In Progress/Done 같은 상태 비중을 한눈에 비교할 때 사용한다.
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
      description: '도넛 조각 배열. 각 항목은 { name, value, color }. color는 CSS 변수(var(--chart-1)) 권장.',
      control: 'object',
      table: { type: { summary: 'Array<{ name: string; value: number; color: string }>' } }
    },
    height: {
      description: '차트 높이(px). innerRadius/outerRadius가 이 값에 비례해 계산된다.',
      control: { type: 'number' },
      table: { type: { summary: 'number' }, defaultValue: { summary: '200' } }
    },
    showLabels: {
      description: '각 조각에 백분율 라벨을 표시할지 여부.',
      control: 'boolean',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'true' } }
    }
  }
}
export default meta
type Story = StoryObj<typeof StatusDonutChart>

/** 기본 상태 분포 예시. */
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

/** 백분율 라벨을 숨긴 형태. 범례를 외부에 따로 둘 때 적합하다. */
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

/** 데이터가 비어 있을 때. 조각 없이 빈 도넛 영역만 렌더된다. */
export const Empty: Story = {
  args: {
    data: []
  }
}
