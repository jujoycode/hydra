import type { Meta, StoryObj } from '@storybook/react'
import { HorizontalBarChart } from './HorizontalBarChart'

/**
 * 카테고리별 값을 가로 막대로 보여준다(세로 레이아웃 BarChart). 라벨이 긴 항목을
 * 비교하기 좋아 담당자별/프로젝트별 이슈 수 같은 순위형 데이터에 적합하다.
 * 단색 또는 가로 그라데이션(gradientId + gradientColors)으로 막대를 채울 수 있다.
 */
const meta: Meta<typeof HorizontalBarChart> = {
  title: 'Atoms/Charts/HorizontalBarChart',
  component: HorizontalBarChart,
  decorators: [
    (Story) => (
      <div className='w-[480px]'>
        <Story />
      </div>
    )
  ],
  argTypes: {
    data: {
      description: '막대 데이터 배열. 각 항목은 Y축 라벨 { name } + dataKey에 대응하는 숫자 필드.',
      control: 'object',
      table: { type: { summary: 'Array<{ name: string; [key: string]: string | number }>' } }
    },
    dataKey: {
      description: '막대 길이로 그릴 값의 키.',
      control: 'text',
      table: { type: { summary: 'string' } }
    },
    fill: {
      description: '막대 단색 채움. gradientId가 없을 때 사용된다. 기본값은 --chart-1 토큰의 런타임 hex.',
      control: 'color',
      table: { type: { summary: 'string' }, defaultValue: { summary: 'var(--chart-1)' } }
    },
    gradientId: {
      description: '그라데이션 채움 id. gradientColors와 함께 지정하면 fill 대신 그라데이션을 적용한다.',
      control: 'text',
      table: { type: { summary: 'string' } }
    },
    gradientColors: {
      description: '가로 그라데이션 시작/끝 색상. { start, end }.',
      control: 'object',
      table: { type: { summary: '{ start: string; end: string }' } }
    },
    height: {
      description: '차트 높이(px).',
      control: { type: 'number' },
      table: { type: { summary: 'number' }, defaultValue: { summary: '200' } }
    },
    yAxisWidth: {
      description: 'Y축(라벨) 영역 너비(px).',
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
    },
    domain: {
      description: 'X축(값) 범위 [최소, 최대]. 미지정 시 데이터에 맞춰 자동 계산.',
      control: 'object',
      table: { type: { summary: '[number, number]' } }
    },
    formatter: {
      description: '툴팁 값 포매터. (value) => [표시값, 표시라벨].',
      control: false,
      table: { type: { summary: '(value: any) => [string, string]' } }
    }
  }
}
export default meta
type Story = StoryObj<typeof HorizontalBarChart>

/** 담당자별 이슈 수 기본 예시. */
export const Default: Story = {
  args: {
    dataKey: 'count',
    data: [
      { name: 'Alice', count: 12 },
      { name: 'Bob', count: 8 },
      { name: 'Carol', count: 5 },
      { name: 'Dave', count: 3 }
    ]
  }
}

/** 가로 그라데이션으로 막대를 채운 예시. */
export const Gradient: Story = {
  args: {
    dataKey: 'count',
    data: [
      { name: 'Alice', count: 12 },
      { name: 'Bob', count: 8 },
      { name: 'Carol', count: 5 }
    ],
    gradientId: 'hbar-grad',
    gradientColors: { start: 'var(--chart-1)', end: 'var(--chart-2)' }
  }
}

/** 데이터가 비어 있을 때. 축만 그려지고 막대는 표시되지 않는다. */
export const Empty: Story = {
  args: {
    dataKey: 'count',
    data: []
  }
}
