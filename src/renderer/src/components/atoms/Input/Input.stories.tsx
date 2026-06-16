import type { Meta, StoryObj } from '@storybook/react'
import { Input } from './Input'

/**
 * 한 줄짜리 텍스트 입력 필드로, 네이티브 input을 Hydra 토큰으로 감싼 것이다. type이나 placeholder,
 * value, disabled 같은 표준 input 속성은 그대로 넘기면 된다. 포커스가 가면 링이 둘리고, aria-invalid를
 * 주면 보더와 링이 destructive 색으로 바뀐다. file 타입 스타일도 미리 들어가 있다.
 */
const meta: Meta<typeof Input> = {
  title: 'Atoms/Input',
  component: Input,
  args: { placeholder: 'Type here…' },
  argTypes: {
    type: {
      description: '네이티브 input type 그대로. text나 password, email, number, file 등을 쓴다.',
      control: 'select',
      options: ['text', 'password', 'email', 'number', 'search', 'tel', 'url', 'file'],
      table: { type: { summary: 'HTMLInputTypeAttribute' }, defaultValue: { summary: 'text' } }
    },
    placeholder: {
      description: '비어 있을 때 자리에 깔리는 안내 문구.',
      control: 'text',
      table: { type: { summary: 'string' } }
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
type Story = StoryObj<typeof Input>

/** 아무것도 건드리지 않은 기본 텍스트 입력. */
export const Default: Story = {}

/** 잠겨서 입력할 수 없는 상태. */
export const Disabled: Story = { args: { disabled: true } }

/** 입력값이 가려지는 비밀번호 타입. */
export const Password: Story = { args: { type: 'password', placeholder: '••••••••' } }

/** aria-invalid를 켜서 오류로 보이게 한 경우. */
export const Invalid: Story = { args: { 'aria-invalid': true, placeholder: '잘못된 값' } }
