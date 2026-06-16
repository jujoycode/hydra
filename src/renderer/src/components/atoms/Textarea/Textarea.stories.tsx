import type { Meta, StoryObj } from '@storybook/react'
import { Textarea } from './Textarea'

/**
 * 여러 줄을 입력하는 필드로, 네이티브 textarea를 Hydra 토큰으로 감싼 것이다. field-sizing-content라
 * 내용이 늘면 높이도 따라 자라되 min-h-16 밑으로는 안 내려간다. placeholder나 value, rows, disabled
 * 같은 표준 textarea 속성은 그대로 넘기면 되고, 포커스 링이나 aria-invalid 오류 스타일도 들어가 있다.
 */
const meta: Meta<typeof Textarea> = {
  title: 'Atoms/Textarea',
  component: Textarea,
  args: { placeholder: 'Write a description…' },
  argTypes: {
    placeholder: {
      description: '비어 있을 때 자리에 깔리는 안내 문구.',
      control: 'text',
      table: { type: { summary: 'string' } }
    },
    rows: {
      description: '처음 보여줄 행 수. 내용이 많아지면 더 늘어난다.',
      control: 'number',
      table: { type: { summary: 'number' } }
    },
    disabled: {
      description: '켜면 입력이 막히고 흐릿해진다.',
      control: 'boolean',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } }
    },
    'aria-invalid': {
      description: '켜면 보더와 링이 destructive 색으로 바뀌어 오류임을 알린다.',
      control: 'boolean',
      table: { type: { summary: 'boolean' } }
    }
  }
}
export default meta
type Story = StoryObj<typeof Textarea>

/** 아무것도 건드리지 않은 기본 모양. */
export const Default: Story = {}

/** 잠겨서 입력할 수 없는 상태. */
export const Disabled: Story = { args: { disabled: true } }

/** 처음부터 내용이 채워져 있는 경우. */
export const WithValue: Story = {
  args: { defaultValue: '여러 줄에 걸친\n설명 텍스트입니다.' }
}
