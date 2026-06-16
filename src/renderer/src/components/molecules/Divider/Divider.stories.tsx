import type { Meta, StoryObj } from '@storybook/react'
import { Divider } from './Divider'

/**
 * 가운데에 텍스트 라벨을 둔 수평 구분선. 라벨 양옆으로 가로선이 이어져
 * "OR", "Or continue with" 같은 섹션 구분 문구를 표시할 때 사용한다.
 */
const meta: Meta<typeof Divider> = {
  title: 'Molecules/Divider',
  component: Divider,
  decorators: [
    (Story) => (
      <div className='w-80 p-6'>
        <Story />
      </div>
    )
  ],
  argTypes: {
    text: {
      description: '구분선 가운데에 표시되는 라벨 텍스트',
      control: 'text',
      table: { type: { summary: 'string' } }
    },
    className: {
      description: '루트 요소에 합쳐지는 추가 Tailwind 클래스',
      control: 'text',
      table: { type: { summary: 'string' } }
    }
  }
}
export default meta
type Story = StoryObj<typeof Divider>

/** 짧은 라벨("OR")이 들어간 기본 구분선. */
export const Default: Story = { args: { text: 'OR' } }

/** 소셜 로그인 등에서 쓰는 긴 안내 라벨. */
export const Continue: Story = { args: { text: 'Or continue with' } }
