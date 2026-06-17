import type { Meta, StoryObj } from '@storybook/react'
import { BubbleChart } from './BubbleChart'

/**
 * 세 축으로 데이터를 흩뿌리는 산점도다. X는 카테고리나 숫자, Y는 값, 버블 크기는 또 다른 값이
 * 맡는다. 이슈 유형별로 중요도는 Y에, 개수는 버블 크기에 태워 한눈에 비교하는 식으로 쓴다. 색은
 * 토큰을 런타임 hex로 읽어 라이트와 다크 테마를 알아서 따라간다.
 */
const meta: Meta<typeof BubbleChart> = {
  title: 'Atoms/Charts/BubbleChart',
  component: BubbleChart,
  decorators: [
    (Story) => (
      <div className='w-[480px]'>
        <Story />
      </div>
    )
  ],
  argTypes: {
    data: {
      description:
        '버블 데이터. 항목은 name, value, count로 이뤄지고 필드를 더 붙여도 된다. 기본 설정에서는 name이 X축, value가 Y축, count가 버블 크기로 들어간다.',
      control: 'object',
      table: { type: { summary: 'Array<{ name: string; value: number; count: number }>' } }
    },
    colors: {
      description: '버블 색상. 인덱스를 돌려가며 적용하고, 안 주면 차트 토큰 기반 기본 팔레트를 쓴다.',
      control: 'object',
      table: { type: { summary: 'string[]' }, defaultValue: { summary: '토큰 기반 기본 팔레트' } }
    },
    height: {
      description: '차트 높이.',
      control: { type: 'number' },
      table: { type: { summary: 'number' }, defaultValue: { summary: '200' } }
    },
    margin: {
      description: '차트 여백.',
      control: 'object',
      table: {
        type: { summary: '{ top: number; right: number; bottom: number; left: number }' },
        defaultValue: { summary: '{ top: 10, right: 10, bottom: 10, left: 10 }' }
      }
    },
    xAxisConfig: {
      description: 'X축 설정. dataKey와 name을 잡고, type으로 카테고리 축인지 숫자 축인지 정한다.',
      control: 'object',
      table: {
        type: { summary: "{ dataKey: string; name: string; type: 'category' | 'number' }" },
        defaultValue: { summary: "{ dataKey: 'name', name: '카테고리', type: 'category' }" }
      }
    },
    yAxisConfig: {
      description: 'Y축 설정. dataKey와 name을 잡으며 언제나 숫자 축이다.',
      control: 'object',
      table: {
        type: { summary: '{ dataKey: string; name: string }' },
        defaultValue: { summary: "{ dataKey: 'value', name: '중요도' }" }
      }
    },
    zAxisConfig: {
      description: '버블 크기를 정하는 Z축 설정. dataKey와 name을 잡고, range로 버블의 최소와 최대 크기를 준다.',
      control: 'object',
      table: {
        type: { summary: '{ dataKey: string; name: string; range: [number, number] }' },
        defaultValue: { summary: "{ dataKey: 'count', name: '이슈 수', range: [30, 120] }" }
      }
    },
    tooltipFormatter: {
      description: '툴팁 값 포매터. value와 name을 받아 화면에 띄울 값과 라벨을 돌려준다.',
      control: false,
      table: { type: { summary: '(value: any, name: string) => [string, string]' } }
    }
  }
}
export default meta
type Story = StoryObj<typeof BubbleChart>

/** 이슈 유형별로 중요도는 Y에, 개수는 버블 크기에 태운 기본 모양. */
export const Default: Story = {
  args: {
    data: [
      { name: 'Bug', value: 12, count: 8 },
      { name: 'Feature', value: 20, count: 5 },
      { name: 'Chore', value: 6, count: 12 },
      { name: 'Docs', value: 4, count: 3 }
    ]
  }
}

/** 팔레트를 한 색만 줘서 버블 색을 통일한 경우. */
export const SingleColor: Story = {
  args: {
    data: [
      { name: 'Bug', value: 12, count: 8 },
      { name: 'Feature', value: 20, count: 5 },
      { name: 'Chore', value: 6, count: 12 }
    ],
    colors: ['var(--chart-1)']
  }
}

/** 데이터가 없으면 축만 남고 버블은 안 그려진다. */
export const Empty: Story = {
  args: {
    data: []
  }
}
