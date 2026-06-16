import type { Meta, StoryObj } from '@storybook/react'
import { Input } from './Input'

/**
 * 한 줄 텍스트 입력 필드. 네이티브 `<input>`을 Hydra 토큰으로 감쌌다.
 *
 * - 표준 input 속성(`type`, `placeholder`, `value`, `disabled` 등)을 그대로 받는다.
 * - 포커스 시 ring, `aria-invalid`일 때 destructive 보더/ring을 보여준다.
 * - file 입력 스타일링도 내장되어 있다.
 */
const meta: Meta<typeof Input> = {
  title: 'Atoms/Input',
  component: Input,
  args: { placeholder: 'Type here…' },
  argTypes: {
    type: {
      description: '입력 타입. text/password/email/number/file 등 네이티브 input type.',
      control: 'select',
      options: ['text', 'password', 'email', 'number', 'search', 'tel', 'url', 'file'],
      table: { type: { summary: 'HTMLInputTypeAttribute' }, defaultValue: { summary: 'text' } }
    },
    placeholder: {
      description: '비어 있을 때 표시되는 안내 문구.',
      control: 'text',
      table: { type: { summary: 'string' } }
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
type Story = StoryObj<typeof Input>

/** 기본 텍스트 입력. */
export const Default: Story = {}

/** 비활성화 상태. */
export const Disabled: Story = { args: { disabled: true } }

/** 비밀번호 입력 타입. */
export const Password: Story = { args: { type: 'password', placeholder: '••••••••' } }

/** aria-invalid로 오류 상태를 표현한 입력. */
export const Invalid: Story = { args: { 'aria-invalid': true, placeholder: '잘못된 값' } }
