import type { Meta, StoryObj } from '@storybook/react'
import { Button } from '@/atoms/Button'
import { DialogTemplate } from './DialogTemplate'

const meta: Meta<typeof DialogTemplate> = {
  title: 'Templates/DialogTemplate',
  component: DialogTemplate
}
export default meta
type Story = StoryObj<typeof DialogTemplate>

export const Default: Story = {
  args: {
    open: true,
    onOpenChange: () => {},
    title: '프로젝트 생성',
    description: '새 프로젝트의 기본 정보를 입력하세요',
    children: <div className='text-sm text-muted-foreground'>폼 컨텐츠 영역</div>,
    footer: (
      <>
        <Button variant='outline'>취소</Button>
        <Button>생성</Button>
      </>
    )
  }
}
