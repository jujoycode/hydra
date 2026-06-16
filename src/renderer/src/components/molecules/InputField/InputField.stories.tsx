import type { Meta, StoryObj } from '@storybook/react'
import { InputField } from './InputField'

/**
 * 라벨 + 입력 + 에러 메시지를 묶는 폼 필드 컨테이너. Context로 `id`/`error`를 자식에 내려주며,
 * 실제 입력은 compound 서브컴포넌트로 조합한다: `InputField.Input`, `InputField.Email`,
 * `InputField.Password`, `InputField.OTP`. `error`가 있으면 하단에 destructive 메시지를 렌더하고
 * 입력에 `aria-invalid`를 부여한다.
 */
const meta: Meta<typeof InputField> = {
  title: 'Molecules/InputField',
  component: InputField,
  decorators: [
    (Story) => (
      <div className='w-80 p-6'>
        <Story />
      </div>
    )
  ],
  argTypes: {
    label: {
      description: '필드 상단에 표시되는 라벨. 생략하면 라벨을 렌더하지 않는다.',
      control: 'text',
      table: { type: { summary: 'string' } }
    },
    error: {
      description: '설정 시 하단에 빨간 에러 메시지를 표시하고 입력에 aria-invalid를 부여한다.',
      control: 'text',
      table: { type: { summary: 'string' } }
    },
    id: {
      description: '라벨/입력을 연결하는 id. 생략하면 useId로 자동 생성한다.',
      control: 'text',
      table: { type: { summary: 'string' } }
    },
    children: {
      description: 'InputField.Input / .Email / .Password / .OTP 등 입력 서브컴포넌트',
      control: false,
      table: { type: { summary: 'ReactNode' } }
    }
  }
}
export default meta
type Story = StoryObj<typeof InputField>

/** 이메일 입력(InputField.Email)을 감싼 기본 텍스트 필드. */
export const Text: Story = {
  render: () => (
    <InputField label='Email'>
      <InputField.Email placeholder='you@example.com' />
    </InputField>
  )
}

/** 비밀번호 입력(InputField.Password) 필드. */
export const Password: Story = {
  render: () => (
    <InputField label='Password'>
      <InputField.Password />
    </InputField>
  )
}

/** error prop이 설정되어 에러 메시지가 노출된 상태. */
export const WithError: Story = {
  render: () => (
    <InputField label='Email' error='Invalid email address'>
      <InputField.Email placeholder='you@example.com' />
    </InputField>
  )
}

/** 6자리 OTP 입력(InputField.OTP). */
export const OTP: Story = {
  render: () => (
    <InputField label='Verification code'>
      <InputField.OTP value='' onChange={() => {}} />
    </InputField>
  )
}
