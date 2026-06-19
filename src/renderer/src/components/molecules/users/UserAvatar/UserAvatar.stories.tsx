import type { Meta, StoryObj } from '@storybook/react'
import { UserAvatar } from './UserAvatar'

/**
 * 사용자 아바타와 이름을, 필요하면 이메일까지 한 줄에 배치하는 컴포넌트다. avatar 이미지가 없으면
 * User 아이콘으로 대체한다. showInfo를 활성화하면 이름과 이메일을 위아래로 쌓고, 비활성화하면 이름만 아바타 옆에
 * 표시한다. 크기는 size로 네 단계 중 선택하고, 왼쪽 또는 가운데 정렬은 align으로 지정한다.
 */
const meta: Meta<typeof UserAvatar> = {
  title: 'Molecules/UserAvatar',
  component: UserAvatar,
  argTypes: {
    name: {
      description: '사용자 이름. 라벨과 이미지 alt에 함께 사용한다.',
      control: 'text',
      table: { type: { summary: 'string' } }
    },
    avatar: {
      description: '아바타 이미지 URL. 비어 있으면 User 아이콘으로 대체한다.',
      control: 'text',
      table: { type: { summary: 'string' } }
    },
    email: {
      description: 'showInfo를 활성화했을 때 이름 아래에 표시하는 이메일.',
      control: 'text',
      table: { type: { summary: 'string' } }
    },
    size: {
      description: '아바타와 글자의 크기 단계.',
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg'],
      table: { type: { summary: "'xs' | 'sm' | 'md' | 'lg'" }, defaultValue: { summary: 'md' } }
    },
    showInfo: {
      description: '활성화하면 이름과 이메일을 위아래로 쌓고, 비활성화하면 이름만 옆에 표시한다.',
      control: 'boolean',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } }
    },
    align: {
      description: '컨테이너 내부 정렬 방식.',
      control: 'radio',
      options: ['left', 'center'],
      table: { type: { summary: "'left' | 'center'" }, defaultValue: { summary: 'left' } }
    },
    fallback: {
      description: '기본 User 아이콘 대신 사용할 노드.',
      control: false,
      table: { type: { summary: 'ReactNode' } }
    },
    className: {
      description: '컨테이너에 추가할 클래스.',
      control: 'text',
      table: { type: { summary: 'string' } }
    }
  }
}
export default meta
type Story = StoryObj<typeof UserAvatar>

/** 이름만 옆에 표시하는 기본 형태. */
export const Default: Story = { args: { name: 'Alice Kim' } }

/** showInfo를 활성화해 이름과 이메일을 함께 표시하는 경우. */
export const WithInfo: Story = { args: { name: 'Alice Kim', email: 'alice@example.com', showInfo: true } }

/** 정보를 함께 표시하며 lg 크기로 키운 아바타. */
export const Large: Story = { args: { name: 'Alice Kim', email: 'alice@example.com', showInfo: true, size: 'lg' } }
