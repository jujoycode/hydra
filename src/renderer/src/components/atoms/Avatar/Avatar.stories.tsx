import type { Meta, StoryObj } from '@storybook/react'
import { Avatar, AvatarFallback, AvatarImage } from './Avatar'

/**
 * 사용자/멤버를 표현하는 원형 아바타. Radix Avatar 위에 Hydra 토큰을 입혔다.
 *
 * - `Avatar`는 `size-8` 원형 컨테이너이며 `className`으로 크기를 덮어쓴다.
 * - `AvatarImage`(src)가 로드되면 이미지를, 실패/미지정이면 `AvatarFallback`(이니셜)을 그라데이션 배경으로 보여준다.
 * - 합성 컴포넌트라 `Avatar` 루트에 노출할 의미 있는 prop은 `className`뿐이다.
 */
const meta: Meta<typeof Avatar> = {
  title: 'Atoms/Avatar',
  component: Avatar,
  argTypes: {
    className: {
      description: '컨테이너 크기/모양 오버라이드. 기본은 size-8 원형이며 size-* 유틸로 키우거나 줄인다.',
      control: 'text',
      table: { type: { summary: 'string' } }
    }
  }
}
export default meta
type Story = StoryObj<typeof Avatar>

/** 이미지 src가 정상 로드된 경우. 이미지가 fallback을 가린다. */
export const WithImage: Story = {
  render: () => (
    <Avatar>
      <AvatarImage src='https://avatars.githubusercontent.com/u/167082674?v=4' alt='avatar' />
      <AvatarFallback>HY</AvatarFallback>
    </Avatar>
  )
}

/** 이미지가 없을 때 이니셜 fallback(그라데이션 배경)이 표시된다. */
export const Fallback: Story = {
  render: () => (
    <Avatar>
      <AvatarFallback>HY</AvatarFallback>
    </Avatar>
  )
}

/** className으로 크기를 키운 큰 아바타. 프로필 헤더 등에 사용한다. */
export const Large: Story = {
  render: () => (
    <Avatar className='size-16'>
      <AvatarImage src='https://avatars.githubusercontent.com/u/167082674?v=4' alt='avatar' />
      <AvatarFallback>HY</AvatarFallback>
    </Avatar>
  )
}
