import type { Meta, StoryObj } from '@storybook/react'
import { Button } from '@/atoms/Button'
import { SettingCard } from './SettingCard'

const meta: Meta<typeof SettingCard> = {
  title: 'Molecules/SettingCard',
  component: SettingCard,
  decorators: [
    (Story) => (
      <div className='w-[480px]'>
        <Story />
      </div>
    )
  ]
}
export default meta
type Story = StoryObj<typeof SettingCard>

export const Default: Story = {
  args: {
    title: 'Profile',
    description: '계정 정보를 관리합니다',
    children: <p className='text-sm text-muted-foreground'>설정 폼 영역</p>,
    footer: <Button>저장</Button>
  }
}
