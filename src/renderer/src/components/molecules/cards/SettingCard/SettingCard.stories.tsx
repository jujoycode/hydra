import type { Meta, StoryObj } from '@storybook/react'
import { Button } from '@/atoms/Button'
import { SettingCard } from './SettingCard'

/**
 * 설정 화면의 한 섹션을 담는 카드. 제목 + 선택적 설명 헤더, 본문(children),
 * 그리고 footer가 있으면 상단 구분선이 그어진 우측 정렬 푸터(보통 저장 버튼)를 렌더한다.
 */
const meta: Meta<typeof SettingCard> = {
  title: 'Molecules/SettingCard',
  component: SettingCard,
  decorators: [
    (Story) => (
      <div className='w-[480px]'>
        <Story />
      </div>
    )
  ],
  argTypes: {
    title: {
      description: '카드 헤더 제목',
      control: 'text',
      table: { type: { summary: 'string' } }
    },
    description: {
      description: '제목 아래 보조 설명(선택)',
      control: 'text',
      table: { type: { summary: 'string' } }
    },
    children: {
      description: '본문에 렌더되는 설정 폼/콘텐츠(ReactNode)',
      control: false,
      table: { type: { summary: 'ReactNode' } }
    },
    footer: {
      description: '설정 시 상단 구분선 + 우측 정렬 푸터로 렌더된다(보통 저장 버튼). 없으면 푸터를 생략한다.',
      control: false,
      table: { type: { summary: 'ReactNode' } }
    },
    className: {
      description: 'Card 루트에 합쳐지는 추가 클래스',
      control: 'text',
      table: { type: { summary: 'string' } }
    }
  }
}
export default meta
type Story = StoryObj<typeof SettingCard>

/** 제목 + 설명 + 본문 + 저장 버튼 푸터를 모두 갖춘 기본 카드. */
export const Default: Story = {
  args: {
    title: 'Profile',
    description: '계정 정보를 관리합니다',
    children: <p className='text-sm text-muted-foreground'>설정 폼 영역</p>,
    footer: <Button>저장</Button>
  }
}

/** footer가 없어 푸터/구분선이 생략된 카드. */
export const WithoutFooter: Story = {
  args: {
    title: 'Danger zone',
    description: '되돌릴 수 없는 작업입니다',
    children: <p className='text-sm text-muted-foreground'>설정 폼 영역</p>
  }
}
