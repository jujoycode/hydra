import type { Meta, StoryObj } from '@storybook/react'
import { InputField } from './InputField'

/**
 * 라벨과 입력, 에러 메시지를 한 덩어리로 묶는 폼 필드 컨테이너다. id와 error는 Context로 자식에게
 * 내려보내고, 실제 입력칸은 InputField.Input, .Email, .Password, .OTP 같은 서브컴포넌트를 끼워
 * 조립한다. error가 들어오면 아래에 빨간 메시지를 띄우면서 입력에 aria-invalid를 달아준다.
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
      description: '필드 위에 붙는 라벨. 안 주면 라벨 자체가 안 나온다.',
      control: 'text',
      table: { type: { summary: 'string' } }
    },
    error: {
      description: '넣으면 아래에 빨간 메시지가 뜨고 입력에 aria-invalid가 붙는다.',
      control: 'text',
      table: { type: { summary: 'string' } }
    },
    id: {
      description: '라벨과 입력을 이어주는 id. 안 주면 useId로 알아서 만든다.',
      control: 'text',
      table: { type: { summary: 'string' } }
    },
    children: {
      description: '안에 끼울 입력 서브컴포넌트. Input이나 Email, Password, OTP 등을 넣는다.',
      control: false,
      table: { type: { summary: 'ReactNode' } }
    }
  }
}
export default meta
type Story = StoryObj<typeof InputField>

/** 이메일 입력을 감싼 가장 기본적인 필드. */
export const Text: Story = {
  render: () => (
    <InputField label='Email'>
      <InputField.Email placeholder='you@example.com' />
    </InputField>
  )
}

/** 비밀번호 입력칸을 넣은 필드. */
export const Password: Story = {
  render: () => (
    <InputField label='Password'>
      <InputField.Password />
    </InputField>
  )
}

/** error를 넘겨 에러 메시지가 보이는 상태. */
export const WithError: Story = {
  render: () => (
    <InputField label='Email' error='Invalid email address'>
      <InputField.Email placeholder='you@example.com' />
    </InputField>
  )
}

/** 여섯 자리 OTP를 받는 입력. */
export const OTP: Story = {
  render: () => (
    <InputField label='Verification code'>
      <InputField.OTP value='' onChange={() => {}} />
    </InputField>
  )
}
