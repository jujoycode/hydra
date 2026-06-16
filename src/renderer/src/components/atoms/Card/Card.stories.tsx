import type { Meta, StoryObj } from '@storybook/react'
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './Card'

/**
 * 관련된 내용을 한 덩어리로 묶어 구획하는 컨테이너로, 둥근 모서리에 보더와 shadow-card가 붙는다.
 * 여러 파트를 조합해 쓴다. 머리말은 CardHeader 안에 CardTitle이나 CardDescription, CardAction을 넣고,
 * 본문은 CardContent, 맨 아래는 CardFooter다. CardHeader가 컨테이너 쿼리 그리드라 CardAction을 두면
 * 액션이 우측 상단에 알아서 붙는다. 전부 div라 손댈 만한 건 className과 평범한 div 속성뿐이다.
 */
const meta: Meta<typeof Card> = {
  title: 'Atoms/Card',
  component: Card,
  argTypes: {
    className: {
      description: '카드 폭이나 여백 같은 레이아웃을 덮어쓴다.',
      control: 'text',
      table: { type: { summary: 'string' } }
    }
  }
}
export default meta
type Story = StoryObj<typeof Card>

/** 머리말, 본문, 푸터를 다 갖춘 기본 카드. */
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

/** 헤더에 CardAction을 넣어 우측 상단에 버튼을 붙인 경우. */
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
