import type { Meta, StoryObj } from '@storybook/react'
import { ArrowRight } from 'lucide-react'
import { Button } from './Button'

/**
 * 클릭 액션의 기본 단위로, shadcn/ui 버튼에 Hydra 토큰인 gradient-primary와 glow를 더했다. 강조 정도는
 * variant, 높이와 패딩은 size로 지정한다. loading을 켜면 스피너와 함께 "Please wait"가 표시되며 그동안
 * 클릭이 차단된다. asChild를 지정하면 button 대신 자식 엘리먼트, 예컨대 a 태그에 스타일만 적용한다.
 */
const meta: Meta<typeof Button> = {
  title: 'Atoms/Button',
  component: Button,
  args: { children: 'Button' },
  argTypes: {
    variant: {
      description:
        '강조 정도. default가 그라데이션으로 가장 강하고, outline과 secondary, ghost는 보조용, destructive는 위험한 액션, link는 텍스트처럼 보인다.',
      control: 'select',
      options: ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'],
      table: {
        type: { summary: 'default | destructive | outline | secondary | ghost | link' },
        defaultValue: { summary: 'default' }
      }
    },
    size: {
      description: '높이와 패딩 프리셋. icon은 아이콘 하나만 담는 정사각형이다.',
      control: 'inline-radio',
      options: ['default', 'sm', 'lg', 'icon'],
      table: { type: { summary: 'default | sm | lg | icon' }, defaultValue: { summary: 'default' } }
    },
    loading: {
      description: '켜면 스피너와 "Please wait"가 표시되며 클릭이 차단된다.',
      control: 'boolean',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } }
    },
    asChild: {
      description: '실제 렌더링을 자식 엘리먼트에 위임한다. 링크에 버튼 모양을 적용할 때 사용한다.',
      control: 'boolean',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } }
    },
    disabled: {
      description: '클릭을 차단하고 절반쯤 흐려진다.',
      control: 'boolean',
      table: { type: { summary: 'boolean' } }
    },
    children: {
      description: '버튼에 들어가는 라벨이나 내용.',
      control: 'text',
      table: { type: { summary: 'ReactNode' } }
    }
  }
}
export default meta
type Story = StoryObj<typeof Button>

/** 기본 그라데이션 버튼. 화면에서 가장 중요한 액션 하나에 사용한다. */
export const Default: Story = {}

/** 테두리에 옅은 배경을 더한 보조 액션용. */
export const Secondary: Story = { args: { variant: 'secondary' } }

/** 삭제처럼 되돌리기 어려운 액션. */
export const Destructive: Story = { args: { variant: 'destructive', children: 'Delete' } }

/** 배경 없이 테두리만 두른 중립적 버튼. */
export const Outline: Story = { args: { variant: 'outline' } }

/** 평상시에는 배경이 없고 hover 시에만 드러나는 버튼. */
export const Ghost: Story = { args: { variant: 'ghost' } }

/** 본문 속 링크처럼 보이는 버튼. */
export const Link: Story = { args: { variant: 'link', children: 'Learn more' } }

/** 툴바나 테이블 행처럼 좁은 자리에 들어가는 작은 버튼. */
export const Small: Story = { args: { size: 'sm' } }

/** 폼 제출처럼 확실히 눈에 띄어야 하는 자리에 사용하는 큰 버튼. */
export const Large: Story = { args: { size: 'lg' } }

/** 비동기 작업이 진행되는 동안의 모습. 그동안 클릭은 차단된다. */
export const Loading: Story = { args: { loading: true } }

/** 라벨 옆에 아이콘을 함께 둔 경우. */
export const WithIcon: Story = {
  args: {
    children: (
      <>
        Continue <ArrowRight />
      </>
    )
  }
}
