import type { Meta, StoryObj } from '@storybook/react'
import { SignInTemplate } from './SignInTemplate'

/**
 * 로그인 화면용 2열 카드 셸. 좌측은 폼(`children`)을 감싼 `<form>`, 우측은 일러스트 이미지(md 이상에서만 표시)이며
 * 하단에 약관/개인정보 고지 문구가 붙는다. `div`의 기본 속성(`className` 포함)을 그대로 받아 전달한다.
 * 로그인 폼을 카드 형태로 배치할 때 사용한다.
 */
const meta: Meta<typeof SignInTemplate> = {
  title: 'Templates/SignInTemplate',
  component: SignInTemplate,
  argTypes: {
    children: {
      description: '좌측 폼 영역에 렌더링될 본문',
      control: false,
      table: { type: { summary: 'ReactNode' } }
    },
    className: {
      description: '루트 컨테이너에 병합되는 추가 클래스',
      control: 'text',
      table: { type: { summary: 'string' } }
    }
  },
  decorators: [
    (Story) => (
      <div className='w-[720px] p-6'>
        <Story />
      </div>
    )
  ]
}
export default meta
type Story = StoryObj<typeof SignInTemplate>

/** 기본 로그인 폼이 좌측에 배치된 예시. */
export const Default: Story = {
  args: {
    children: (
      <div className='flex flex-col gap-4'>
        <h1 className='text-xl font-bold'>Welcome back</h1>
        <div className='rounded-md border border-dashed p-6 text-center text-sm text-muted-foreground'>로그인 폼</div>
      </div>
    )
  }
}
