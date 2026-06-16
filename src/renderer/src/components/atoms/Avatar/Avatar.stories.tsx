import type { Meta, StoryObj } from '@storybook/react'
import { Avatar, AvatarFallback, AvatarImage } from './Avatar'

/**
 * 멤버를 나타내는 원형 아바타로, Radix Avatar에 Hydra 토큰을 입힌 것이다. 기본은 size-8짜리 원이고
 * 크기는 className으로 덮어쓴다. AvatarImage의 src가 잘 로드되면 그 이미지를 쓰고, 로드에 실패하거나
 * src가 아예 없으면 AvatarFallback의 이니셜을 그라데이션 배경 위에 대신 보여준다. 합성 컴포넌트라
 * 루트에서 만질 만한 건 className 정도다.
 */
const meta: Meta<typeof Avatar> = {
  title: 'Atoms/Avatar',
  component: Avatar,
  argTypes: {
    className: {
      description: '컨테이너 크기와 모양을 덮어쓴다. 기본 size-8에서 size-* 유틸로 키우거나 줄이면 된다.',
      control: 'text',
      table: { type: { summary: 'string' } }
    }
  }
}
export default meta
type Story = StoryObj<typeof Avatar>

/** src가 제대로 로드돼서 이미지가 fallback을 덮은 경우. */
export const WithImage: Story = {
  render: () => (
    <Avatar>
      <AvatarImage src='https://avatars.githubusercontent.com/u/167082674?v=4' alt='avatar' />
      <AvatarFallback>HY</AvatarFallback>
    </Avatar>
  )
}

/** 이미지가 없어서 이니셜 fallback이 그라데이션 배경으로 뜨는 모양. */
export const Fallback: Story = {
  render: () => (
    <Avatar>
      <AvatarFallback>HY</AvatarFallback>
    </Avatar>
  )
}

/** className으로 키운 큰 아바타. 프로필 헤더처럼 크게 보여줄 자리에 쓴다. */
export const Large: Story = {
  render: () => (
    <Avatar className='size-16'>
      <AvatarImage src='https://avatars.githubusercontent.com/u/167082674?v=4' alt='avatar' />
      <AvatarFallback>HY</AvatarFallback>
    </Avatar>
  )
}
