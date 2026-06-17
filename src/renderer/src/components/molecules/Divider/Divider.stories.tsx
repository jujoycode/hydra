import type { Meta, StoryObj } from '@storybook/react'
import { Divider } from './Divider'

/**
 * 가운데에 라벨을 둔 가로 구분선이다. 라벨 양옆으로 선이 이어지며,
 * 'OR'이나 'Or continue with'처럼 섹션을 구분하는 문구를 넣을 때 사용한다.
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
      description: '선 가운데에 표시할 라벨 텍스트.',
      control: 'text',
      table: { type: { summary: 'string' } }
    },
    className: {
      description: '루트에 추가할 Tailwind 클래스.',
      control: 'text',
      table: { type: { summary: 'string' } }
    }
  }
}
export default meta
type Story = StoryObj<typeof Divider>

/** 'OR' 한 단어만 넣은 기본 형태. */
export const Default: Story = { args: { text: 'OR' } }

/** 소셜 로그인 등에서 사용하는 다소 긴 안내 라벨. */
export const Continue: Story = { args: { text: 'Or continue with' } }
