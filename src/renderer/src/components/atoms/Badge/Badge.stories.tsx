import type { Meta, StoryObj } from '@storybook/react'
import { Badge } from './Badge'

/**
 * 상태/라벨/카운트 등 짧은 메타 정보를 표시하는 알약형 태그. CVA로 variant·size·colorScheme 3축을 조합한다.
 *
 * - `variant`는 채움 방식(진한 채움/틴트/보더 등), `colorScheme`은 색 계열, `size`는 패딩/글자 크기를 정한다.
 * - 모든 조합은 AA 대비를 지키도록 동계열 텍스트 색을 사용한다(solid도 흰 전경 대신 어두운 동계열 텍스트).
 * - 선택적 `icon`을 children 앞에 렌더한다.
 */
const meta: Meta<typeof Badge> = {
  title: 'Atoms/Badge',
  component: Badge,
  args: { children: 'Badge' },
  argTypes: {
    variant: {
      description: '채움 스타일. solid=진한 동계열 채움, subtle/surface=틴트 배경, outline=보더, plain=배경 없음.',
      control: 'select',
      options: ['solid', 'subtle', 'outline', 'surface', 'plain'],
      table: {
        type: { summary: 'solid | subtle | outline | surface | plain' },
        defaultValue: { summary: 'subtle' }
      }
    },
    size: {
      description: '패딩과 글자 크기. xs→lg 순으로 커진다.',
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg'],
      table: { type: { summary: 'xs | sm | md | lg' }, defaultValue: { summary: 'sm' } }
    },
    colorScheme: {
      description: '색 계열. variant와 조합되어 배경/텍스트/보더 색을 결정한다.',
      control: 'select',
      options: ['gray', 'red', 'orange', 'yellow', 'green', 'teal', 'blue', 'cyan', 'purple', 'pink'],
      table: {
        type: { summary: 'gray | red | orange | yellow | green | teal | blue | cyan | purple | pink' },
        defaultValue: { summary: 'gray' }
      }
    },
    children: {
      description: '뱃지에 표시할 텍스트/노드.',
      control: 'text',
      table: { type: { summary: 'ReactNode' } }
    },
    icon: {
      description: 'children 앞에 렌더할 선택적 아이콘 노드.',
      control: false,
      table: { type: { summary: 'ReactNode' } }
    }
  }
}
export default meta
type Story = StoryObj<typeof Badge>

/** 기본값(subtle · sm · gray). 가장 흔한 메타 라벨용. */
export const Default: Story = {}

/** 보더만 그리는 outline variant. */
export const Outline: Story = { args: { variant: 'outline' } }

/** 진한 동계열 채움(solid)에 색 계열을 적용한 예. */
export const Solid: Story = { args: { variant: 'solid', colorScheme: 'green', children: 'Open' } }

/** colorScheme로 색 계열을 바꾼 subtle 뱃지. 상태 색 구분에 사용한다. */
export const ColorScheme: Story = { args: { colorScheme: 'red', children: 'Blocked' } }

/** size를 키운 큰 뱃지. */
export const Large: Story = { args: { size: 'lg' } }
