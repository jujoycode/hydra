import type { Meta, StoryObj } from '@storybook/react'
import { BubbleChart } from './BubbleChart'

/**
 * 세 축으로 데이터를 표현하는 산점도다. X는 카테고리나 숫자, Y는 값, 버블 크기는 또 다른 값을
 * 담당한다. 이슈 유형별로 중요도는 Y에, 개수는 버블 크기로 나타내 함께 비교하는 용도로 쓴다. 색은
 * 토큰을 런타임 hex로 읽어 라이트와 다크 테마를 따른다.
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
        '버블 데이터. 항목은 name, value, count로 구성되며 필드를 추가할 수 있다. 기본 설정에서는 name이 X축, value가 Y축, count가 버블 크기에 매핑된다.',
      control: 'object',
      table: { type: { summary: 'Array<{ name: string; value: number; count: number }>' } }
    },
    colors: {
      description: '버블 색상. 인덱스 순서로 순환 적용하며, 지정하지 않으면 차트 토큰 기반 기본 팔레트를 사용한다.',
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
      description: 'X축 설정. dataKey와 name을 지정하고, type으로 카테고리 축인지 숫자 축인지 결정한다.',
      control: 'object',
      table: {
        type: { summary: "{ dataKey: string; name: string; type: 'category' | 'number' }" },
        defaultValue: { summary: "{ dataKey: 'name', name: '카테고리', type: 'category' }" }
      }
    },
    yAxisConfig: {
      description: 'Y축 설정. dataKey와 name을 지정하며 항상 숫자 축이다.',
      control: 'object',
      table: {
        type: { summary: '{ dataKey: string; name: string }' },
        defaultValue: { summary: "{ dataKey: 'value', name: '중요도' }" }
      }
    },
    zAxisConfig: {
      description:
        '버블 크기를 결정하는 Z축 설정. dataKey와 name을 지정하고, range로 버블의 최소와 최대 크기를 정한다.',
      control: 'object',
      table: {
        type: { summary: '{ dataKey: string; name: string; range: [number, number] }' },
        defaultValue: { summary: "{ dataKey: 'count', name: '이슈 수', range: [30, 120] }" }
      }
    },
    tooltipFormatter: {
      description: '툴팁 값 포매터. value와 name을 받아 화면에 표시할 값과 라벨을 반환한다.',
      control: false,
      table: { type: { summary: '(value: any, name: string) => [string, string]' } }
    }
  }
}
export default meta
type Story = StoryObj<typeof BubbleChart>

/** 이슈 유형별로 중요도는 Y에, 개수는 버블 크기로 나타낸 기본 형태다. */
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

/** 팔레트에 단일 색만 지정해 버블 색을 통일한 경우다. */
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

/** 데이터가 없으면 축만 남고 버블은 그려지지 않는다. */
export const Empty: Story = {
  args: {
    data: []
  }
}
