import type { Meta, StoryObj } from '@storybook/react'
import { AuthLayout } from './AuthLayout'

const meta: Meta<typeof AuthLayout> = {
  title: 'Templates/AuthLayout',
  component: AuthLayout,
  parameters: { layout: 'fullscreen' }
}
export default meta
type Story = StoryObj<typeof AuthLayout>

export const SignIn: Story = {
  args: {
    title: '로그인',
    subtitle: '워크스페이스에 로그인하세요',
    children: (
      <div className='rounded-md border border-dashed p-8 text-center text-sm text-muted-foreground'>폼 영역</div>
    )
  }
}

export const AdminSetup: Story = {
  args: {
    title: '관리자 설정',
    subtitle: '첫 관리자 계정을 생성하세요',
    children: (
      <div className='rounded-md border border-dashed p-8 text-center text-sm text-muted-foreground'>셋업 폼</div>
    )
  }
}
