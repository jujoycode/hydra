import type { Meta, StoryObj } from '@storybook/react'
import { UserAvatar } from './UserAvatar'

/**
 * 사용자 아바타 + 이름(선택적으로 이메일)을 한 줄로 표시하는 컴포넌트.
 * `avatar` 이미지가 없으면 User 아이콘 fallback을 보여준다. `showInfo`가 true면
 * 이름/이메일을 세로 스택으로, false면 이름만 옆에 표시한다. `size`로 4단계 크기를,
 * `align`으로 좌측/가운데 정렬을 조절한다.
 */
const meta: Meta<typeof UserAvatar> = {
  title: 'Molecules/UserAvatar',
  component: UserAvatar,
  argTypes: {
    name: {
      description: '사용자 이름. fallback alt 및 라벨로 사용된다.',
      control: 'text',
      table: { type: { summary: 'string' } }
    },
    avatar: {
      description: '아바타 이미지 URL. 없으면 User 아이콘 fallback을 표시한다.',
      control: 'text',
      table: { type: { summary: 'string' } }
    },
    email: {
      description: 'showInfo가 true일 때 이름 아래에 표시되는 이메일',
      control: 'text',
      table: { type: { summary: 'string' } }
    },
    size: {
      description: '아바타/텍스트 크기 단계',
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg'],
      table: { type: { summary: "'xs' | 'sm' | 'md' | 'lg'" }, defaultValue: { summary: 'md' } }
    },
    showInfo: {
      description: 'true면 이름+이메일을 세로 스택으로, false면 이름만 옆에 표시한다.',
      control: 'boolean',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } }
    },
    align: {
      description: '컨테이너 내 정렬',
      control: 'radio',
      options: ['left', 'center'],
      table: { type: { summary: "'left' | 'center'" }, defaultValue: { summary: 'left' } }
    },
    fallback: {
      description: '기본 User 아이콘 대신 사용할 fallback 노드(ReactNode)',
      control: false,
      table: { type: { summary: 'ReactNode' } }
    },
    className: {
      description: '컨테이너에 합쳐지는 추가 클래스',
      control: 'text',
      table: { type: { summary: 'string' } }
    }
  }
}
export default meta
type Story = StoryObj<typeof UserAvatar>

/** 이름만 옆에 표시되는 기본 아바타. */
export const Default: Story = { args: { name: 'Alice Kim' } }

/** showInfo로 이름 + 이메일을 함께 표시. */
export const WithInfo: Story = { args: { name: 'Alice Kim', email: 'alice@example.com', showInfo: true } }

/** lg 크기의 정보 포함 아바타. */
export const Large: Story = { args: { name: 'Alice Kim', email: 'alice@example.com', showInfo: true, size: 'lg' } }
