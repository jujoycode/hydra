import type { Meta, StoryObj } from '@storybook/react'
import { Checkbox } from './Checkbox'

/**
 * 켜고 끄는 체크박스다. Radix 기반이라 checked로 직접 쥐고 흔들 수도 있고, defaultChecked만
 * 넘기고 나머지는 맡겨둘 수도 있다. 켜지면 배경이 채워지면서 체크 표시가 뜬다. 오류는
 * aria-invalid로 링을 둘러 알리고, disabled를 주면 잠긴다.
 */
const meta: Meta<typeof Checkbox> = {
  title: 'Atoms/Checkbox',
  component: Checkbox,
  argTypes: {
    checked: {
      description: '직접 제어할 때 쓰는 체크 상태. true/false 말고, 부분 선택을 뜻하는 "indeterminate"도 받는다.',
      control: 'boolean',
      table: { type: { summary: 'boolean | "indeterminate"' } }
    },
    defaultChecked: {
      description: '제어를 맡겨둘 때의 처음 상태.',
      control: 'boolean',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } }
    },
    disabled: {
      description: '켜면 클릭이 막히고 흐릿해진다.',
      control: 'boolean',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } }
    },
    onCheckedChange: {
      description: '체크가 바뀔 때마다 불린다.',
      control: false,
      table: { category: 'Events', type: { summary: '(checked: boolean | "indeterminate") => void' } }
    }
  }
}
export default meta
type Story = StoryObj<typeof Checkbox>

/** 아무것도 건드리지 않은 기본 상태. */
export const Default: Story = {}

/** 처음부터 켜져 있는 경우. */
export const Checked: Story = { args: { defaultChecked: true } }

/** 잠겨서 누를 수 없는 상태. */
export const Disabled: Story = { args: { disabled: true } }
