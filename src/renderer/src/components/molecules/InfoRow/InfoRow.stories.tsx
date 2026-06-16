import type { Meta, StoryObj } from '@storybook/react'
import { InfoRow } from './InfoRow'

/**
 * 라벨 + 값을 4칸 그리드로 나란히 배치하는 정보 행. 상세 패널이나 설정 화면에서
 * "Status: In Progress"처럼 속성을 한 줄씩 표시할 때 사용한다.
 * `labelWidth`로 라벨이 차지하는 칸 수를 조절하면 값 칸은 자동으로 나머지를 채운다.
 */
const meta: Meta<typeof InfoRow> = {
  title: 'Molecules/InfoRow',
  component: InfoRow,
  decorators: [
    (Story) => (
      <div className='w-96 p-6'>
        <Story />
      </div>
    )
  ],
  argTypes: {
    label: {
      description: '왼쪽에 굵게 표시되는 속성 라벨',
      control: 'text',
      table: { type: { summary: 'string' } }
    },
    value: {
      description: '오른쪽에 표시되는 값(텍스트 또는 ReactNode)',
      control: 'text',
      table: { type: { summary: 'ReactNode' } }
    },
    labelWidth: {
      description: '4칸 그리드 중 라벨이 차지하는 칸 수. 값 칸은 (4 - labelWidth)칸을 차지한다.',
      control: 'select',
      options: [1, 2, 3, 4],
      table: { type: { summary: '1 | 2 | 3 | 4' }, defaultValue: { summary: '1' } }
    }
  }
}
export default meta
type Story = StoryObj<typeof InfoRow>

/** 라벨 1칸 + 값 3칸의 기본 비율. */
export const Default: Story = { args: { label: 'Status', value: 'In Progress' } }

/** 라벨을 2칸으로 넓혀 긴 라벨을 수용. */
export const WideLabel: Story = { args: { label: 'Created at', value: '2026-06-14', labelWidth: 2 } }
