import type { Meta, StoryObj } from '@storybook/react'
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './Card'

/**
 * 콘텐츠를 묶어 시각적으로 구획하는 컨테이너. 둥근 모서리 + 보더 + `shadow-card`를 가진다.
 *
 * - 합성 컴포넌트 묶음이다: `CardHeader`(CardTitle/CardDescription/CardAction) · `CardContent` · `CardFooter`.
 * - `CardHeader`는 컨테이너 쿼리 그리드라 `CardAction`을 두면 우측 상단에 액션이 정렬된다.
 * - 모든 파트는 div 기반이라 의미 있는 prop은 `className`과 표준 div 속성뿐이다.
 */
const meta: Meta<typeof Card> = {
  title: 'Atoms/Card',
  component: Card,
  argTypes: {
    className: {
      description: '카드 컨테이너의 폭/여백 등 레이아웃 오버라이드.',
      control: 'text',
      table: { type: { summary: 'string' } }
    }
  }
}
export default meta
type Story = StoryObj<typeof Card>

/** 헤더·본문·푸터를 모두 갖춘 기본 카드. */
export const Default: Story = {
  render: () => (
    <Card className='w-80'>
      <CardHeader>
        <CardTitle>프로젝트</CardTitle>
        <CardDescription>이슈 12건 · 멤버 3명</CardDescription>
      </CardHeader>
      <CardContent>카드 본문 영역입니다.</CardContent>
      <CardFooter>푸터</CardFooter>
    </Card>
  )
}

/** CardAction을 헤더에 배치해 우측 상단 액션을 표시한 예. */
export const WithAction: Story = {
  render: () => (
    <Card className='w-80'>
      <CardHeader>
        <CardTitle>프로젝트</CardTitle>
        <CardDescription>이슈 12건 · 멤버 3명</CardDescription>
        <CardAction>
          <button type='button' className='rounded border px-2 py-1 text-xs'>
            설정
          </button>
        </CardAction>
      </CardHeader>
      <CardContent>헤더 우측에 액션 버튼이 정렬된다.</CardContent>
    </Card>
  )
}
