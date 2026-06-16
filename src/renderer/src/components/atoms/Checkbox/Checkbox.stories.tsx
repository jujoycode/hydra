import type { Meta, StoryObj } from '@storybook/react'
import { Checkbox } from './Checkbox'

/**
 * 불리언 선택을 위한 체크박스. Radix Checkbox 기반이라 controlled/uncontrolled 모두 지원한다.
 *
 * - 체크 상태에서 `bg-primary` 배경 + 체크 아이콘을 표시한다.
 * - `checked`/`onCheckedChange`로 제어하거나 `defaultChecked`로 비제어 사용한다.
 * - `aria-invalid`로 오류 링을, `disabled`로 비활성 상태를 표현한다.
 */
const meta: Meta<typeof Checkbox> = {
  title: 'Atoms/Checkbox',
  component: Checkbox,
  argTypes: {
    checked: {
      description: '제어형 체크 상태. true/false 또는 부분선택을 위한 "indeterminate".',
      control: 'boolean',
      table: { type: { summary: 'boolean | "indeterminate"' } }
    },
    defaultChecked: {
      description: '비제어형 초기 체크 상태.',
      control: 'boolean',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } }
    },
    disabled: {
      description: 'true면 상호작용을 막고 투명도를 낮춘다.',
      control: 'boolean',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } }
    },
    onCheckedChange: {
      description: '체크 상태 변경 콜백.',
      control: false,
      table: { category: 'Events', type: { summary: '(checked: boolean | "indeterminate") => void' } }
    }
  }
}
export default meta
type Story = StoryObj<typeof Checkbox>

/** 비제어 기본 상태(미체크). */
export const Default: Story = {}

/** 초기부터 체크된 상태. */
export const Checked: Story = { args: { defaultChecked: true } }

/** 비활성화되어 클릭할 수 없는 상태. */
export const Disabled: Story = { args: { disabled: true } }
