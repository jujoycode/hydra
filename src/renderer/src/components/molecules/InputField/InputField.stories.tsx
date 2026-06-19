import type { Meta, StoryObj } from '@storybook/react'
import { InputField } from './InputField'

/**
 * 라벨, 입력, 에러 메시지를 하나로 묶는 폼 필드 컨테이너다. id와 error는 Context로 자식에게
 * 전달하며, 실제 입력칸은 InputField.Input, .Email, .Password, .OTP 같은 서브컴포넌트를 조합해
 * 구성한다. error가 전달되면 아래에 에러 메시지를 표시하고 입력에 aria-invalid를 설정한다.
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
      description: '필드 위에 표시하는 라벨. 지정하지 않으면 라벨을 표시하지 않는다.',
      control: 'text',
      table: { type: { summary: 'string' } }
    },
    error: {
      description: '지정하면 아래에 에러 메시지를 표시하고 입력에 aria-invalid를 설정한다.',
      control: 'text',
      table: { type: { summary: 'string' } }
    },
    id: {
      description: '라벨과 입력을 연결하는 id. 지정하지 않으면 useId로 생성한다.',
      control: 'text',
      table: { type: { summary: 'string' } }
    },
    children: {
      description: '내부에 배치할 입력 서브컴포넌트. Input, Email, Password, OTP 등을 넣는다.',
      control: false,
      table: { type: { summary: 'ReactNode' } }
    }
  }
}
export default meta
type Story = StoryObj<typeof InputField>

/** 이메일 입력을 감싼 기본 필드. */
export const Text: Story = {
  render: () => (
    <InputField label='Email'>
      <InputField.Email placeholder='you@example.com' />
    </InputField>
  )
}

/** 비밀번호 입력칸을 배치한 필드. */
export const Password: Story = {
  render: () => (
    <InputField label='Password'>
      <InputField.Password />
    </InputField>
  )
}

/** error를 전달해 에러 메시지가 표시되는 상태. */
export const WithError: Story = {
  render: () => (
    <InputField label='Email' error='Invalid email address'>
      <InputField.Email placeholder='you@example.com' />
    </InputField>
  )
}

/** 여섯 자리 OTP를 입력받는 필드. */
export const OTP: Story = {
  render: () => (
    <InputField label='Verification code'>
      <InputField.OTP value='' onChange={() => {}} />
    </InputField>
  )
}
