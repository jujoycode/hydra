import type { Meta, StoryObj } from '@storybook/react'
import { AuthLayout } from './AuthLayout'

/**
 * 로그인과 관리자 설정 같은 인증 화면이 공통으로 사용하는 골격이다. 왼쪽에 브랜드 패널을 두고 오른쪽에 폼 카드를
 * 배치하는 2열 구조이며, 브랜드 패널은 md 이상에서만 노출된다. 제목과 부제는 별도 슬롯으로 받고 실제 폼은 children
 * 위치에 배치한다. 로그인과 셋업 흐름의 페이지 골격으로 사용한다.
 */
const meta: Meta<typeof AuthLayout> = {
  title: 'Templates/AuthLayout',
  component: AuthLayout,
  parameters: { layout: 'fullscreen' },
  argTypes: {
    title: { description: '카드 상단에 굵게 표시되는 제목.', control: 'text', table: { type: { summary: 'string' } } },
    subtitle: {
      description: '제목 아래에 표시되는 보조 설명.',
      control: 'text',
      table: { type: { summary: 'string' } }
    },
    children: { description: '카드에 배치할 폼이나 본문.', control: false, table: { type: { summary: 'ReactNode' } } }
  }
}
export default meta
type Story = StoryObj<typeof AuthLayout>

/** 워크스페이스에 로그인하는 화면이다. */
export const SignIn: Story = {
  args: {
    title: '로그인',
    subtitle: '워크스페이스에 로그인하세요',
    children: (
      <div className='rounded-md border border-dashed p-8 text-center text-sm text-muted-foreground'>폼 영역</div>
    )
  }
}

/** 빈 DB에 처음 연결했을 때 첫 관리자 계정을 생성하는 셋업 화면이다. */
export const AdminSetup: Story = {
  args: {
    title: '관리자 설정',
    subtitle: '첫 관리자 계정을 생성하세요',
    children: (
      <div className='rounded-md border border-dashed p-8 text-center text-sm text-muted-foreground'>셋업 폼</div>
    )
  }
}
