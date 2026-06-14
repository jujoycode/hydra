import type { Meta, StoryObj } from '@storybook/react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './Card'

const meta: Meta<typeof Card> = {
  title: 'Atoms/Card',
  component: Card
}
export default meta
type Story = StoryObj<typeof Card>

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
