import type { Meta, StoryObj } from '@storybook/react'
import { SignInTemplate } from './SignInTemplate'

/**
 * 로그인 화면을 위한 2열 카드이다. 왼쪽은 children을 form으로 감싼 폼 영역이고 오른쪽은 일러스트 영역이며,
 * 일러스트는 md 이상에서만 노출된다. 카드 하단에는 약관과 개인정보 고지 문구가 표시된다. className을 비롯한 div
 * 속성은 그대로 루트 요소로 전달한다.
 */
const meta: Meta<typeof SignInTemplate> = {
  title: 'Templates/SignInTemplate',
  component: SignInTemplate,
  argTypes: {
    children: {
      description: '왼쪽 폼 영역을 채우는 본문.',
      control: false,
      table: { type: { summary: 'ReactNode' } }
    },
    className: {
      description: '루트 컨테이너에 덧붙이는 클래스.',
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

/** 왼쪽에 기본 로그인 폼을 배치한 형태이다. */
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
