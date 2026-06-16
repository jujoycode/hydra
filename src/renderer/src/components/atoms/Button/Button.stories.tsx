import type { Meta, StoryObj } from '@storybook/react'
import { ArrowRight } from 'lucide-react'
import { Button } from './Button'

/**
 * 모든 클릭 액션의 기본 단위. shadcn/ui 버튼을 Hydra 토큰(gradient-primary, glow)으로 확장했다.
 *
 * - `variant`로 시각적 강조 수준을, `size`로 높이/패딩을 제어한다.
 * - `loading`이 true면 스피너 + "Please wait" 문구를 보여주고 자동으로 비활성화된다.
 * - `asChild`를 켜면 `<button>` 대신 자식 엘리먼트(예: `<a>`)에 스타일을 위임한다(Radix Slot).
 */
const meta: Meta<typeof Button> = {
  title: 'Atoms/Button',
  component: Button,
  args: { children: 'Button' },
  argTypes: {
    variant: {
      description:
        '시각적 강조 수준. 기본(gradient) → outline/secondary/ghost(보조) → destructive(파괴) → link(텍스트)',
      control: 'select',
      options: ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'],
      table: {
        type: { summary: 'default | destructive | outline | secondary | ghost | link' },
        defaultValue: { summary: 'default' }
      }
    },
    size: {
      description: '버튼 높이/패딩 프리셋. `icon`은 정사각형(아이콘 전용)',
      control: 'inline-radio',
      options: ['default', 'sm', 'lg', 'icon'],
      table: { type: { summary: 'default | sm | lg | icon' }, defaultValue: { summary: 'default' } }
    },
    loading: {
      description: 'true면 스피너와 "Please wait"를 표시하고 클릭을 막는다.',
      control: 'boolean',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } }
    },
    asChild: {
      description: '렌더 엘리먼트를 자식으로 위임(Radix Slot). 링크 등에 버튼 스타일을 입힐 때 사용.',
      control: 'boolean',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } }
    },
    disabled: {
      description: '상호작용을 막고 50% 투명도로 표시한다.',
      control: 'boolean',
      table: { type: { summary: 'boolean' } }
    },
    children: { description: '버튼 라벨/내용', control: 'text', table: { type: { summary: 'ReactNode' } } }
  }
}
export default meta
type Story = StoryObj<typeof Button>

/** 기본 그라데이션 버튼. 화면당 1개의 주요 액션에만 사용한다. */
export const Default: Story = {}

/** 보조 액션용 — 테두리 + 배경 강조. */
export const Secondary: Story = { args: { variant: 'secondary' } }

/** 삭제·취소 등 되돌리기 어려운 파괴적 액션. */
export const Destructive: Story = { args: { variant: 'destructive', children: 'Delete' } }

/** 중립적인 테두리 버튼. */
export const Outline: Story = { args: { variant: 'outline' } }

/** 배경 없이 hover 시에만 강조되는 최소 강조 버튼. */
export const Ghost: Story = { args: { variant: 'ghost' } }

/** 인라인 텍스트 링크처럼 보이는 버튼. */
export const Link: Story = { args: { variant: 'link', children: 'Learn more' } }

/** 좁은 영역(툴바, 테이블 행)용 작은 버튼. */
export const Small: Story = { args: { size: 'sm' } }

/** 강조가 필요한 폼 제출 등에 쓰는 큰 버튼. */
export const Large: Story = { args: { size: 'lg' } }

/** 비동기 처리 중 상태 — 클릭이 자동으로 막힌다. */
export const Loading: Story = { args: { loading: true } }

/** 라벨과 함께 아이콘을 배치한 예시. */
export const WithIcon: Story = {
  args: {
    children: (
      <>
        Continue <ArrowRight />
      </>
    )
  }
}
