import type { Meta, StoryObj } from '@storybook/react'
import { Button } from '@/atoms/Button'
import { SettingCard } from './SettingCard'

/**
 * 설정 화면의 섹션 하나를 통째로 담는 카드다. 제목과 (있으면) 설명이 헤더에 오고 그 아래 본문이
 * 들어간다. footer를 넘기면 위에 구분선을 긋고 오른쪽으로 정렬한 푸터를 붙이는데, 보통 저장 버튼이 온다.
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
      description: '카드 헤더에 들어가는 제목.',
      control: 'text',
      table: { type: { summary: 'string' } }
    },
    description: {
      description: '제목 밑에 붙이는 설명. 없어도 된다.',
      control: 'text',
      table: { type: { summary: 'string' } }
    },
    children: {
      description: '본문에 들어갈 설정 폼이나 콘텐츠.',
      control: false,
      table: { type: { summary: 'ReactNode' } }
    },
    footer: {
      description: '넘기면 구분선과 함께 오른쪽 정렬 푸터로 나온다. 안 주면 푸터를 통째로 뺀다.',
      control: false,
      table: { type: { summary: 'ReactNode' } }
    },
    className: {
      description: 'Card 루트에 덧붙일 클래스.',
      control: 'text',
      table: { type: { summary: 'string' } }
    }
  }
}
export default meta
type Story = StoryObj<typeof SettingCard>

/** 제목, 설명, 본문, 저장 버튼 푸터까지 다 붙은 기본 카드. */
export const Default: Story = {
  args: {
    title: 'Profile',
    description: '계정 정보를 관리합니다',
    children: <p className='text-sm text-muted-foreground'>설정 폼 영역</p>,
    footer: <Button>저장</Button>
  }
}

/** footer를 안 줘서 푸터와 구분선이 빠진 카드. */
export const WithoutFooter: Story = {
  args: {
    title: 'Danger zone',
    description: '되돌릴 수 없는 작업입니다',
    children: <p className='text-sm text-muted-foreground'>설정 폼 영역</p>
  }
}
