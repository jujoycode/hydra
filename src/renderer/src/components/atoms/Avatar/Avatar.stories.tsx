import type { Meta, StoryObj } from '@storybook/react'
import { Avatar, AvatarFallback, AvatarImage } from './Avatar'

/**
 * 멤버를 나타내는 원형 아바타로, Radix Avatar에 Hydra 토큰을 적용했다. 기본은 size-8 원이며 크기는
 * className으로 덮어쓴다. AvatarImage의 src가 정상 로드되면 해당 이미지를 사용하고, 로드에 실패하거나
 * src가 없으면 AvatarFallback의 이니셜을 그라데이션 배경 위에 표시한다. 합성 컴포넌트이므로 루트에서
 * 조정할 수 있는 속성은 className 정도다.
 */
const meta: Meta<typeof Avatar> = {
  title: 'Atoms/Avatar',
  component: Avatar,
  argTypes: {
    className: {
      description: '컨테이너의 크기와 모양을 덮어쓴다. 기본 size-8에서 size-* 유틸리티로 조정한다.',
      control: 'text',
      table: { type: { summary: 'string' } }
    }
  }
}
export default meta
type Story = StoryObj<typeof Avatar>

/** src가 정상 로드되어 이미지가 fallback을 대체한 경우. */
export const WithImage: Story = {
  render: () => (
    <Avatar>
      <AvatarImage src='https://avatars.githubusercontent.com/u/167082674?v=4' alt='avatar' />
      <AvatarFallback>HY</AvatarFallback>
    </Avatar>
  )
}

/** 이미지가 없어 이니셜 fallback이 그라데이션 배경으로 표시되는 경우. */
export const Fallback: Story = {
  render: () => (
    <Avatar>
      <AvatarFallback>HY</AvatarFallback>
    </Avatar>
  )
}

/** className으로 키운 큰 아바타. 프로필 헤더처럼 크게 노출하는 자리에 사용한다. */
export const Large: Story = {
  render: () => (
    <Avatar className='size-16'>
      <AvatarImage src='https://avatars.githubusercontent.com/u/167082674?v=4' alt='avatar' />
      <AvatarFallback>HY</AvatarFallback>
    </Avatar>
  )
}
