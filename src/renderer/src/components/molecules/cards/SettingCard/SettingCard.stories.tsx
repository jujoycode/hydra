import type { Meta, StoryObj } from '@storybook/react'
import { Button } from '@/atoms/Button'
import { SettingCard } from './SettingCard'

/**
 * 설정 화면의 한 섹션을 담는 카드다. 제목과 선택적 설명이 헤더에 오고 그 아래에 본문이
 * 들어간다. footer를 전달하면 위에 구분선을 두고 오른쪽으로 정렬한 푸터를 표시하며, 주로 저장 버튼을 배치한다.
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
      description: '카드 헤더에 표시하는 제목.',
      control: 'text',
      table: { type: { summary: 'string' } }
    },
    description: {
      description: '제목 아래에 표시하는 설명. 선택 사항이다.',
      control: 'text',
      table: { type: { summary: 'string' } }
    },
    children: {
      description: '본문에 표시할 설정 폼이나 콘텐츠.',
      control: false,
      table: { type: { summary: 'ReactNode' } }
    },
    footer: {
      description: '전달하면 구분선과 함께 오른쪽 정렬 푸터로 표시한다. 지정하지 않으면 푸터를 표시하지 않는다.',
      control: false,
      table: { type: { summary: 'ReactNode' } }
    },
    className: {
      description: 'Card 루트에 추가할 클래스.',
      control: 'text',
      table: { type: { summary: 'string' } }
    }
  }
}
export default meta
type Story = StoryObj<typeof SettingCard>

/** 제목, 설명, 본문, 저장 버튼 푸터를 모두 갖춘 기본 카드. */
export const Default: Story = {
  args: {
    title: 'Profile',
    description: '계정 정보를 관리합니다',
    children: <p className='text-sm text-muted-foreground'>설정 폼 영역</p>,
    footer: <Button>저장</Button>
  }
}

/** footer를 지정하지 않아 푸터와 구분선이 없는 카드. */
export const WithoutFooter: Story = {
  args: {
    title: 'Danger zone',
    description: '되돌릴 수 없는 작업입니다',
    children: <p className='text-sm text-muted-foreground'>설정 폼 영역</p>
  }
}
