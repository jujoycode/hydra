import type { Meta, StoryObj } from '@storybook/react'
import { Badge } from './Badge'

/**
 * 상태나 개수처럼 짧은 정보를 보여주는 알약 모양 태그다. 채우는 방식은 variant로, 색은
 * colorScheme으로, 크기는 size로 고른다. 어떤 조합을 써도 글자색은 배경과 같은 계열의 진한
 * 톤이라 대비가 충분하다. solid조차 흰 글자가 아니라 어두운 동계열 글자를 쓴다. icon을 넘기면
 * 글자 왼쪽에 붙는다.
 */
const meta: Meta<typeof Badge> = {
  title: 'Atoms/Badge',
  component: Badge,
  args: { children: 'Badge' },
  argTypes: {
    variant: {
      description:
        '채우는 방식. solid는 진하게 채우고, subtle과 surface는 옅게 깔고, outline은 테두리만, plain은 글자만 남긴다.',
      control: 'select',
      options: ['solid', 'subtle', 'outline', 'surface', 'plain'],
      table: {
        type: { summary: 'solid | subtle | outline | surface | plain' },
        defaultValue: { summary: 'subtle' }
      }
    },
    size: {
      description: '크기. xs가 가장 작고 lg로 갈수록 커진다.',
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg'],
      table: { type: { summary: 'xs | sm | md | lg' }, defaultValue: { summary: 'sm' } }
    },
    colorScheme: {
      description: '색 계열. variant와 맞물려 배경과 글자, 테두리 색이 정해진다.',
      control: 'select',
      options: ['gray', 'red', 'orange', 'yellow', 'green', 'teal', 'blue', 'cyan', 'purple', 'pink'],
      table: {
        type: { summary: 'gray | red | orange | yellow | green | teal | blue | cyan | purple | pink' },
        defaultValue: { summary: 'gray' }
      }
    },
    children: {
      description: '태그에 들어갈 텍스트나 노드.',
      control: 'text',
      table: { type: { summary: 'ReactNode' } }
    },
    icon: {
      description: '글자 앞에 붙일 아이콘. 없어도 된다.',
      control: false,
      table: { type: { summary: 'ReactNode' } }
    }
  }
}
export default meta
type Story = StoryObj<typeof Badge>

/** 가장 자주 보게 될 기본 모양. subtle, sm, gray 조합이다. */
export const Default: Story = {}

/** 테두리만 두른 모양. */
export const Outline: Story = { args: { variant: 'outline' } }

/** 진하게 채운 뒤 색을 입혀봤다. */
export const Solid: Story = { args: { variant: 'solid', colorScheme: 'green', children: 'Open' } }

/** 색만 바꿔 상태를 구분하는 경우. */
export const ColorScheme: Story = { args: { colorScheme: 'red', children: 'Blocked' } }

/** 한 단계 키운 뱃지. */
export const Large: Story = { args: { size: 'lg' } }
