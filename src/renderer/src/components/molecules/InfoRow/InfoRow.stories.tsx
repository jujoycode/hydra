import type { Meta, StoryObj } from '@storybook/react'
import { InfoRow } from './InfoRow'

/**
 * 라벨과 값을 4칸 그리드에 나란히 앉히는 정보 한 줄이다. 상세 패널이나 설정 화면에서
 * "Status: In Progress"처럼 속성을 한 줄씩 나열할 때 쓴다. labelWidth로 라벨이 차지할 칸 수를
 * 정하면 값은 알아서 남는 칸을 채운다.
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
      description: '왼쪽에 굵게 들어가는 속성 이름.',
      control: 'text',
      table: { type: { summary: 'string' } }
    },
    value: {
      description: '오른쪽에 들어가는 값. 글자든 노드든 받는다.',
      control: 'text',
      table: { type: { summary: 'ReactNode' } }
    },
    labelWidth: {
      description: '4칸 중 라벨이 먹을 칸 수. 나머지는 값이 가져간다.',
      control: 'select',
      options: [1, 2, 3, 4],
      table: { type: { summary: '1 | 2 | 3 | 4' }, defaultValue: { summary: '1' } }
    }
  }
}
export default meta
type Story = StoryObj<typeof InfoRow>

/** 라벨 한 칸, 값 세 칸인 기본 비율. */
export const Default: Story = { args: { label: 'Status', value: 'In Progress' } }

/** 라벨이 길어 두 칸까지 넓힌 경우. */
export const WideLabel: Story = { args: { label: 'Created at', value: '2026-06-14', labelWidth: 2 } }
