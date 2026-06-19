import type { Meta, StoryObj } from '@storybook/react'
import { Textarea } from './Textarea'

/**
 * 여러 줄을 입력하는 필드로, 네이티브 textarea를 Hydra 토큰으로 감쌌다. field-sizing-content이므로
 * 내용이 늘면 높이도 따라 늘어나되 min-h-16 아래로는 내려가지 않는다. placeholder, value, rows, disabled
 * 같은 표준 textarea 속성을 그대로 전달하며, 포커스 링과 aria-invalid 오류 스타일도 기본 제공된다.
 */
const meta: Meta<typeof Textarea> = {
  title: 'Atoms/Textarea',
  component: Textarea,
  args: { placeholder: 'Write a description…' },
  argTypes: {
    placeholder: {
      description: '비어 있을 때 표시되는 안내 문구.',
      control: 'text',
      table: { type: { summary: 'string' } }
    },
    rows: {
      description: '처음 표시할 행 수. 내용이 많아지면 더 늘어난다.',
      control: 'number',
      table: { type: { summary: 'number' } }
    },
    disabled: {
      description: '켜면 입력이 차단되고 흐려진다.',
      control: 'boolean',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } }
    },
    'aria-invalid': {
      description: '켜면 보더와 링이 destructive 색으로 바뀌어 오류를 알린다.',
      control: 'boolean',
      table: { type: { summary: 'boolean' } }
    }
  }
}
export default meta
type Story = StoryObj<typeof Textarea>

/** 기본 형태. */
export const Default: Story = {}

/** 비활성화되어 입력할 수 없는 상태. */
export const Disabled: Story = { args: { disabled: true } }

/** 처음부터 내용이 채워져 있는 경우. */
export const WithValue: Story = {
  args: { defaultValue: '여러 줄에 걸친\n설명 텍스트입니다.' }
}
