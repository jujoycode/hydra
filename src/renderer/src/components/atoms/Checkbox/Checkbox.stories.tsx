import type { Meta, StoryObj } from '@storybook/react'
import { Checkbox } from './Checkbox'

/**
 * 켜고 끄는 체크박스다. Radix 기반이라 checked로 제어하거나 defaultChecked로 두고 비제어로 쓸 수 있다.
 * 체크되면 배경이 채워지면서 체크 표시가 나타난다. 오류는 aria-invalid로 링을 둘러 알리고, disabled를
 * 지정하면 비활성화된다.
 */
const meta: Meta<typeof Checkbox> = {
  title: 'Atoms/Checkbox',
  component: Checkbox,
  argTypes: {
    checked: {
      description: '제어 모드에서 사용하는 체크 상태. true와 false 외에 부분 선택을 뜻하는 "indeterminate"도 받는다.',
      control: 'boolean',
      table: { type: { summary: 'boolean | "indeterminate"' } }
    },
    defaultChecked: {
      description: '비제어 모드에서의 초기 상태.',
      control: 'boolean',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } }
    },
    disabled: {
      description: '켜면 클릭이 차단되고 흐려진다.',
      control: 'boolean',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } }
    },
    onCheckedChange: {
      description: '체크 상태가 바뀔 때마다 호출된다.',
      control: false,
      table: { category: 'Events', type: { summary: '(checked: boolean | "indeterminate") => void' } }
    }
  }
}
export default meta
type Story = StoryObj<typeof Checkbox>

/** 기본 상태. */
export const Default: Story = {}

/** 처음부터 체크되어 있는 경우. */
export const Checked: Story = { args: { defaultChecked: true } }

/** 비활성화되어 클릭할 수 없는 상태. */
export const Disabled: Story = { args: { disabled: true } }
