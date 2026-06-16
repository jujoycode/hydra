import type { Meta, StoryObj } from '@storybook/react'
import { AuthLayout } from './AuthLayout'

/**
 * 로그인이나 관리자 설정 같은 인증 화면이 공통으로 쓰는 껍데기다. 왼쪽엔 브랜드 패널이 오고 오른쪽엔 폼 카드가
 * 놓이는 2열 구조인데, 브랜드 패널은 md 이상에서만 보인다. 제목과 부제는 따로 슬롯으로 받고 실제 폼은 children
 * 자리에 끼워 넣으면 된다. 로그인이나 셋업 흐름의 페이지 골격으로 쓴다.
 */
const meta: Meta<typeof AuthLayout> = {
  title: 'Templates/AuthLayout',
  component: AuthLayout,
  parameters: { layout: 'fullscreen' },
  argTypes: {
    title: { description: '카드 맨 위에 굵게 들어가는 제목.', control: 'text', table: { type: { summary: 'string' } } },
    subtitle: { description: '제목 아래 한 줄 거드는 설명.', control: 'text', table: { type: { summary: 'string' } } },
    children: { description: '카드에 들어갈 폼이나 본문.', control: false, table: { type: { summary: 'ReactNode' } } }
  }
}
export default meta
type Story = StoryObj<typeof AuthLayout>

/** 워크스페이스에 로그인하는 화면 모습. */
export const SignIn: Story = {
  args: {
    title: '로그인',
    subtitle: '워크스페이스에 로그인하세요',
    children: (
      <div className='rounded-md border border-dashed p-8 text-center text-sm text-muted-foreground'>폼 영역</div>
    )
  }
}

/** 빈 DB에 처음 붙었을 때 첫 관리자 계정을 만드는 셋업 화면. */
export const AdminSetup: Story = {
  args: {
    title: '관리자 설정',
    subtitle: '첫 관리자 계정을 생성하세요',
    children: (
      <div className='rounded-md border border-dashed p-8 text-center text-sm text-muted-foreground'>셋업 폼</div>
    )
  }
}
