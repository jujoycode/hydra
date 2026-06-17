import type { Meta, StoryObj } from '@storybook/react'
import { HorizontalBarChart } from './HorizontalBarChart'

/**
 * 카테고리별 값을 가로로 누운 막대로 보여준다. 라벨이 긴 항목도 잘 들어가서 담당자별이나
 * 프로젝트별 이슈 수처럼 순위를 매기는 데이터에 잘 맞는다. 막대는 단색으로 채워도 되고, gradientId와
 * gradientColors를 같이 주면 가로 그라데이션으로도 채울 수 있다.
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
      description: '막대 데이터. 항목마다 Y축 라벨이 될 name과, dataKey가 가리키는 숫자 필드를 담는다.',
      control: 'object',
      table: { type: { summary: 'Array<{ name: string; [key: string]: string | number }>' } }
    },
    dataKey: {
      description: '막대 길이로 그릴 값의 키.',
      control: 'text',
      table: { type: { summary: 'string' } }
    },
    fill: {
      description: '막대를 채우는 단색. gradientId가 없을 때 쓰이고, 기본값은 --chart-1 토큰의 런타임 hex다.',
      control: 'color',
      table: { type: { summary: 'string' }, defaultValue: { summary: 'var(--chart-1)' } }
    },
    gradientId: {
      description: '그라데이션 채움 id. gradientColors와 같이 주면 fill 대신 그라데이션이 적용된다.',
      control: 'text',
      table: { type: { summary: 'string' } }
    },
    gradientColors: {
      description: '가로 그라데이션의 시작 색과 끝 색.',
      control: 'object',
      table: { type: { summary: '{ start: string; end: string }' } }
    },
    height: {
      description: '차트 높이.',
      control: { type: 'number' },
      table: { type: { summary: 'number' }, defaultValue: { summary: '200' } }
    },
    yAxisWidth: {
      description: '라벨이 들어가는 Y축 영역 너비.',
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
    },
    domain: {
      description: '값을 그리는 X축의 최소와 최대 범위. 안 주면 데이터에 맞춰 알아서 잡힌다.',
      control: 'object',
      table: { type: { summary: '[number, number]' } }
    },
    formatter: {
      description: '툴팁 값 포매터. value를 받아 화면에 띄울 값과 라벨을 돌려준다.',
      control: false,
      table: { type: { summary: '(value: any) => [string, string]' } }
    }
  }
}
export default meta
type Story = StoryObj<typeof HorizontalBarChart>

/** 담당자별 이슈 수를 보여주는 기본 모양. */
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

/** 막대를 가로 그라데이션으로 채운 경우. */
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

/** 데이터가 없으면 축만 남고 막대는 안 그려진다. */
export const Empty: Story = {
  args: {
    dataKey: 'count',
    data: []
  }
}
