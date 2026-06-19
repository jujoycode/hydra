import type { Meta, StoryObj } from '@storybook/react'
import { Input } from './Input'

/**
 * 한 줄 텍스트 입력 필드로, 네이티브 input을 Hydra 토큰으로 감쌌다. type, placeholder, value, disabled
 * 같은 표준 input 속성을 그대로 전달한다. 포커스 시 링이 표시되고, aria-invalid를 지정하면 보더와 링이
 * destructive 색으로 바뀐다. file 타입 스타일도 기본 제공된다.
 */
const meta: Meta<typeof Input> = {
  title: 'Atoms/Input',
  component: Input,
  args: { placeholder: 'Type here…' },
  argTypes: {
    type: {
      description: '네이티브 input type을 그대로 사용한다. text, password, email, number, file 등을 지정한다.',
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
type Story = StoryObj<typeof Input>

/** 기본 텍스트 입력. */
export const Default: Story = {}

/** 비활성화되어 입력할 수 없는 상태. */
export const Disabled: Story = { args: { disabled: true } }

/** 입력값이 가려지는 비밀번호 타입. */
export const Password: Story = { args: { type: 'password', placeholder: '••••••••' } }

/** aria-invalid를 켜서 오류 상태로 표시한 경우. */
export const Invalid: Story = { args: { 'aria-invalid': true, placeholder: '잘못된 값' } }
