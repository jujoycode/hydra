import type { Meta, StoryObj } from '@storybook/react'
import { Button } from '@/atoms/Button'
import { DialogTemplate } from './DialogTemplate'

/**
 * 제목, 설명, 본문, 푸터 자리를 갖춘 모달 껍데기다. shadcn Dialog를 감싸서 공통 골격만 잡아준다. onSubmit을
 * 넘기면 본문과 푸터를 form으로 묶어주기 때문에 프로젝트나 이슈를 새로 만들거나 고치는 입력 폼 모달로 바로 쓸 수
 * 있다.
 */
const meta: Meta<typeof DialogTemplate> = {
  title: 'Templates/DialogTemplate',
  component: DialogTemplate,
  argTypes: {
    open: { description: '모달이 떠 있는지 여부.', control: 'boolean', table: { type: { summary: 'boolean' } } },
    onOpenChange: {
      description: '바깥 클릭이나 ESC 등으로 열림 상태가 바뀔 때 불린다.',
      control: false,
      table: { type: { summary: '(open: boolean) => void' } }
    },
    title: { description: '모달 헤더에 들어가는 제목.', control: 'text', table: { type: { summary: 'string' } } },
    description: { description: '제목 밑에 덧붙이는 설명.', control: 'text', table: { type: { summary: 'string' } } },
    children: { description: '폼이나 내용을 채우는 본문.', control: false, table: { type: { summary: 'ReactNode' } } },
    footer: { description: '주로 액션 버튼이 오는 푸터.', control: false, table: { type: { summary: 'ReactNode' } } },
    maxWidthClass: {
      description: '본문 최대 너비를 정하는 Tailwind 클래스.',
      control: 'text',
      table: { type: { summary: 'string' }, defaultValue: { summary: 'sm:max-w-[425px]' } }
    },
    onSubmit: {
      description: '넘기면 본문과 푸터가 form으로 묶여서 제출 시 이 핸들러가 불린다.',
      control: false,
      table: { type: { summary: '(e: React.FormEvent) => void' } }
    }
  }
}
export default meta
type Story = StoryObj<typeof DialogTemplate>

/** 제목과 설명, 본문, 그리고 취소와 생성 버튼이 들어간 푸터까지 다 채운 기본 모습. */
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
