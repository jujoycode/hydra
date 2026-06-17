import type { Meta, StoryObj } from '@storybook/react'
import { Divider } from './Divider'

/**
 * 가운데에 라벨이 박힌 가로 구분선이다. 라벨을 사이에 두고 양옆으로 선이 뻗어서,
 * "OR"이나 "Or continue with"처럼 섹션을 나누는 문구를 끼워 넣을 때 쓴다.
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
      description: '선 가운데에 들어갈 라벨 글자.',
      control: 'text',
      table: { type: { summary: 'string' } }
    },
    className: {
      description: '루트에 덧붙일 Tailwind 클래스.',
      control: 'text',
      table: { type: { summary: 'string' } }
    }
  }
}
export default meta
type Story = StoryObj<typeof Divider>

/** 짧은 "OR" 한 단어만 끼운 기본 모양. */
export const Default: Story = { args: { text: 'OR' } }

/** 소셜 로그인 같은 데서 보게 되는 좀 더 긴 안내 라벨. */
export const Continue: Story = { args: { text: 'Or continue with' } }
