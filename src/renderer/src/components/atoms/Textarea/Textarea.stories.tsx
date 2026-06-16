import type { Meta, StoryObj } from '@storybook/react'
import { Textarea } from './Textarea'

/**
 * 여러 줄 텍스트 입력 필드. 네이티브 `<textarea>`를 Hydra 토큰으로 감쌌다.
 *
 * - `field-sizing-content`라 내용에 맞춰 높이가 자라며 최소 `min-h-16`을 유지한다.
 * - 표준 textarea 속성(`placeholder`, `value`, `rows`, `disabled` 등)을 그대로 받는다.
 * - 포커스 ring, `aria-invalid` 오류 스타일을 내장한다.
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
      description: '초기 표시 행 수. 내용에 따라 더 늘어날 수 있다.',
      control: 'number',
      table: { type: { summary: 'number' } }
    },
    disabled: {
      description: 'true면 입력을 막고 투명도를 낮춘다.',
      control: 'boolean',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } }
    },
    'aria-invalid': {
      description: 'true면 오류 상태(destructive 보더/ring)로 표시한다.',
      control: 'boolean',
      table: { type: { summary: 'boolean' } }
    }
  }
}
export default meta
type Story = StoryObj<typeof Textarea>

/** 기본 textarea. */
export const Default: Story = {}

/** 비활성화 상태. */
export const Disabled: Story = { args: { disabled: true } }

/** 초기 내용이 채워진 textarea. */
export const WithValue: Story = {
  args: { defaultValue: '여러 줄에 걸친\n설명 텍스트입니다.' }
}
