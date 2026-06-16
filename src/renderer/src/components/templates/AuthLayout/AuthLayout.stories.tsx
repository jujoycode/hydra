import type { Meta, StoryObj } from '@storybook/react'
import { AuthLayout } from './AuthLayout'

/**
 * 로그인/관리자 설정 등 인증 화면의 공통 셸. 좌측 브랜드 패널(md 이상에서만 표시) + 우측 폼 카드 구조이며,
 * 제목/부제 슬롯과 본문(`children`) 슬롯을 제공한다. 로그인·셋업 등 인증 흐름의 페이지 골격으로 사용한다.
 */
const meta: Meta<typeof AuthLayout> = {
  title: 'Templates/AuthLayout',
  component: AuthLayout,
  parameters: { layout: 'fullscreen' },
  argTypes: {
    title: { description: '카드 상단 제목', control: 'text', table: { type: { summary: 'string' } } },
    subtitle: { description: '제목 아래 보조 설명', control: 'text', table: { type: { summary: 'string' } } },
    children: { description: '폼 등 카드 본문 슬롯', control: false, table: { type: { summary: 'ReactNode' } } }
  }
}
export default meta
type Story = StoryObj<typeof AuthLayout>

/** 워크스페이스 로그인 화면 예시. */
export const SignIn: Story = {
  args: {
    title: '로그인',
    subtitle: '워크스페이스에 로그인하세요',
    children: (
      <div className='rounded-md border border-dashed p-8 text-center text-sm text-muted-foreground'>폼 영역</div>
    )
  }
}

/** 빈 DB 최초 연결 시 노출되는 관리자 계정 셋업 화면 예시. */
export const AdminSetup: Story = {
  args: {
    title: '관리자 설정',
    subtitle: '첫 관리자 계정을 생성하세요',
    children: (
      <div className='rounded-md border border-dashed p-8 text-center text-sm text-muted-foreground'>셋업 폼</div>
    )
  }
}
