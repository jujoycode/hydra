import type { Meta, StoryObj } from '@storybook/react'
import { BubbleChart } from './BubbleChart'

/**
 * 세 개의 축(X 카테고리/숫자, Y 값, Z 버블 크기)으로 데이터를 산점도 버블로 표현한다.
 * 예를 들어 이슈 유형별 중요도(Y)와 개수(버블 크기)를 동시에 비교할 때 사용한다.
 * 색상은 토큰을 런타임 hex로 읽어 라이트/다크 테마를 자동으로 따른다.
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
        '버블 데이터 배열. 각 항목은 { name, value, count }(+추가 필드 허용). 기본 설정에서 name→X, value→Y, count→버블 크기에 매핑된다.',
      control: 'object',
      table: { type: { summary: 'Array<{ name: string; value: number; count: number }>' } }
    },
    colors: {
      description: '버블 색상 배열. 인덱스를 순환 적용한다. 미지정 시 차트 토큰 기반 기본 팔레트.',
      control: 'object',
      table: { type: { summary: 'string[]' }, defaultValue: { summary: '토큰 기반 기본 팔레트' } }
    },
    height: {
      description: '차트 높이(px).',
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
      description: 'X축 설정. { dataKey, name, type }. type은 카테고리/숫자 축을 결정한다.',
      control: 'object',
      table: {
        type: { summary: "{ dataKey: string; name: string; type: 'category' | 'number' }" },
        defaultValue: { summary: "{ dataKey: 'name', name: '카테고리', type: 'category' }" }
      }
    },
    yAxisConfig: {
      description: 'Y축 설정. { dataKey, name }. 항상 숫자 축이다.',
      control: 'object',
      table: {
        type: { summary: '{ dataKey: string; name: string }' },
        defaultValue: { summary: "{ dataKey: 'value', name: '중요도' }" }
      }
    },
    zAxisConfig: {
      description: 'Z축(버블 크기) 설정. { dataKey, name, range }. range는 [최소, 최대] 픽셀 크기.',
      control: 'object',
      table: {
        type: { summary: '{ dataKey: string; name: string; range: [number, number] }' },
        defaultValue: { summary: "{ dataKey: 'count', name: '이슈 수', range: [30, 120] }" }
      }
    },
    tooltipFormatter: {
      description: '툴팁 값 포매터. (value, name) => [표시값, 표시라벨].',
      control: false,
      table: { type: { summary: '(value: any, name: string) => [string, string]' } }
    }
  }
}
export default meta
type Story = StoryObj<typeof BubbleChart>

/** 이슈 유형별 중요도(Y)와 개수(버블 크기) 기본 예시. */
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

/** 단색 팔레트로 모든 버블을 동일 색상으로 통일한 예시. */
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

/** 데이터가 비어 있을 때. 축만 그려지고 버블은 표시되지 않는다. */
export const Empty: Story = {
  args: {
    data: []
  }
}
