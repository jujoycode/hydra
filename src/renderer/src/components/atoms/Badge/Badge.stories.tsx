import type { Meta, StoryObj } from '@storybook/react'
import { Badge } from './Badge'

/**
 * 상태나 개수처럼 짧은 정보를 표시하는 알약 모양 태그다. 채우는 방식은 variant, 색은 colorScheme,
 * 크기는 size로 지정한다. 어떤 조합에서도 글자색은 배경과 같은 계열의 진한 톤이라 대비가 충분하다.
 * solid 역시 흰 글자가 아니라 어두운 동계열 글자를 사용한다. icon을 전달하면 글자 왼쪽에 배치된다.
 */
const meta: Meta<typeof Badge> = {
  title: 'Atoms/Badge',
  component: Badge,
  args: { children: 'Badge' },
  argTypes: {
    variant: {
      description:
        '채우는 방식. solid는 진하게 채우고, subtle과 surface는 옅게 채우며, outline은 테두리만, plain은 글자만 남긴다.',
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
      description: '색 계열. variant와 함께 배경, 글자, 테두리 색을 결정한다.',
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
      description: '글자 앞에 배치할 아이콘. 선택 사항이다.',
      control: false,
      table: { type: { summary: 'ReactNode' } }
    }
  }
}
export default meta
type Story = StoryObj<typeof Badge>

/** 가장 일반적인 기본 형태. subtle, sm, gray 조합이다. */
export const Default: Story = {}

/** 테두리만 두른 형태. */
export const Outline: Story = { args: { variant: 'outline' } }

/** 진하게 채우고 색을 적용한 예. */
export const Solid: Story = { args: { variant: 'solid', colorScheme: 'green', children: 'Open' } }

/** 색으로 상태를 구분하는 경우. */
export const ColorScheme: Story = { args: { colorScheme: 'red', children: 'Blocked' } }

/** 한 단계 키운 뱃지. */
export const Large: Story = { args: { size: 'lg' } }
