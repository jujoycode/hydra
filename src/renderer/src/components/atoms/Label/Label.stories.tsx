import type { Meta, StoryObj } from '@storybook/react'
import { Input } from '../Input'
import { Label } from './Label'

/**
 * 폼 컨트롤에 붙는 접근성 라벨. Radix Label 기반이라 `htmlFor`로 입력과 연결된다.
 *
 * - 연결된 입력이 disabled면(peer/group-data) 라벨도 흐려지고 클릭이 막힌다.
 * - `flex` + `gap-2`라 아이콘이나 보조 텍스트를 children으로 나란히 둘 수 있다.
 */
const meta: Meta<typeof Label> = {
  title: 'Atoms/Label',
  component: Label,
  args: { children: 'Email' },
  argTypes: {
    htmlFor: {
      description: '연결할 폼 컨트롤의 id. 클릭 시 해당 컨트롤에 포커스를 준다.',
      control: 'text',
      table: { type: { summary: 'string' } }
    },
    children: {
      description: '라벨 텍스트/노드.',
      control: 'text',
      table: { type: { summary: 'ReactNode' } }
    }
  }
}
export default meta
type Story = StoryObj<typeof Label>

/** 단독 라벨 텍스트. */
export const Default: Story = {}

/** htmlFor로 입력과 연결한 예. 라벨 클릭 시 입력에 포커스된다. */
export const WithInput: Story = {
  render: () => (
    <div className='grid w-72 gap-2'>
      <Label htmlFor='email'>Email</Label>
      <Input id='email' placeholder='you@example.com' />
    </div>
  )
}
