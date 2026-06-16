import type { Meta, StoryObj } from '@storybook/react'
import { UserAvatar } from './UserAvatar'

/**
 * 사용자 아바타와 이름을, 필요하면 이메일까지 한 줄에 늘어놓는 컴포넌트다. avatar 이미지가 없으면
 * User 아이콘으로 대신 채운다. showInfo를 켜면 이름과 이메일을 위아래로 쌓고, 끄면 이름만 아바타 옆에
 * 붙인다. 크기는 size로 네 단계 중 고르고 좌측이나 가운데 정렬은 align으로 정한다.
 */
const meta: Meta<typeof UserAvatar> = {
  title: 'Molecules/UserAvatar',
  component: UserAvatar,
  argTypes: {
    name: {
      description: '사용자 이름. 라벨로도 쓰고 이미지 alt로도 쓴다.',
      control: 'text',
      table: { type: { summary: 'string' } }
    },
    avatar: {
      description: '아바타 이미지 URL. 비면 User 아이콘으로 대신한다.',
      control: 'text',
      table: { type: { summary: 'string' } }
    },
    email: {
      description: 'showInfo를 켰을 때 이름 밑에 따라오는 이메일.',
      control: 'text',
      table: { type: { summary: 'string' } }
    },
    size: {
      description: '아바타와 글자 크기 단계.',
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg'],
      table: { type: { summary: "'xs' | 'sm' | 'md' | 'lg'" }, defaultValue: { summary: 'md' } }
    },
    showInfo: {
      description: '켜면 이름과 이메일을 위아래로 쌓고, 끄면 이름만 옆에 둔다.',
      control: 'boolean',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } }
    },
    align: {
      description: '컨테이너 안에서의 정렬.',
      control: 'radio',
      options: ['left', 'center'],
      table: { type: { summary: "'left' | 'center'" }, defaultValue: { summary: 'left' } }
    },
    fallback: {
      description: '기본 User 아이콘 대신 채울 노드.',
      control: false,
      table: { type: { summary: 'ReactNode' } }
    },
    className: {
      description: '컨테이너에 덧붙일 클래스.',
      control: 'text',
      table: { type: { summary: 'string' } }
    }
  }
}
export default meta
type Story = StoryObj<typeof UserAvatar>

/** 이름만 옆에 붙는 가장 기본 모양. */
export const Default: Story = { args: { name: 'Alice Kim' } }

/** showInfo를 켜서 이름과 이메일을 같이 보여주는 경우. */
export const WithInfo: Story = { args: { name: 'Alice Kim', email: 'alice@example.com', showInfo: true } }

/** 정보까지 보여주면서 lg 크기로 키운 아바타. */
export const Large: Story = { args: { name: 'Alice Kim', email: 'alice@example.com', showInfo: true, size: 'lg' } }
