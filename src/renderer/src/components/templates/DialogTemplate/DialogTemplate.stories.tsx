import type { Meta, StoryObj } from '@storybook/react'
import { Button } from '@/atoms/Button'
import { DialogTemplate } from './DialogTemplate'

/**
 * 제목·설명·본문·푸터 슬롯을 갖춘 표준 다이얼로그 셸. shadcn `Dialog`를 감싸 모달의 공통 골격을 제공한다.
 * `onSubmit`을 넘기면 본문/푸터를 `<form>`으로 감싸 폼 제출형 다이얼로그(생성/수정 등)로 동작한다.
 * 프로젝트·이슈 생성처럼 입력 폼이 들어가는 모달에 사용한다.
 */
const meta: Meta<typeof DialogTemplate> = {
  title: 'Templates/DialogTemplate',
  component: DialogTemplate,
  argTypes: {
    open: { description: '다이얼로그 열림/닫힘 상태', control: 'boolean', table: { type: { summary: 'boolean' } } },
    onOpenChange: {
      description: '열림 상태 변경 핸들러. (open: boolean) => void',
      control: false,
      table: { type: { summary: '(open: boolean) => void' } }
    },
    title: { description: '다이얼로그 제목', control: 'text', table: { type: { summary: 'string' } } },
    description: { description: '제목 아래 보조 설명(선택)', control: 'text', table: { type: { summary: 'string' } } },
    children: { description: '본문 슬롯(폼/컨텐츠 영역)', control: false, table: { type: { summary: 'ReactNode' } } },
    footer: { description: '푸터 슬롯(주로 액션 버튼)', control: false, table: { type: { summary: 'ReactNode' } } },
    maxWidthClass: {
      description: '컨텐츠 최대 너비 Tailwind 클래스',
      control: 'text',
      table: { type: { summary: 'string' }, defaultValue: { summary: 'sm:max-w-[425px]' } }
    },
    onSubmit: {
      description: '폼 제출 핸들러(선택). 지정 시 본문/푸터가 <form>으로 감싸진다. (e: FormEvent) => void',
      control: false,
      table: { type: { summary: '(e: React.FormEvent) => void' } }
    }
  }
}
export default meta
type Story = StoryObj<typeof DialogTemplate>

/** 제목·설명·본문·취소/생성 버튼 푸터를 갖춘 기본 다이얼로그. */
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
