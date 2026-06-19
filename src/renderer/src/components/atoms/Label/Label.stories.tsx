import type { Meta, StoryObj } from '@storybook/react'
import { Input } from '../Input'
import { Label } from './Label'

/**
 * 폼 컨트롤에 연결하는 접근성 라벨로, Radix Label 기반이라 htmlFor로 입력과 연결된다. 연결된 입력이
 * disabled면 peer와 group-data에 의해 라벨도 함께 흐려지고 클릭이 차단된다. 안쪽이 flex에 gap-2이므로
 * 아이콘이나 보조 텍스트를 children으로 나란히 배치할 수 있다.
 */
const meta: Meta<typeof Label> = {
  title: 'Atoms/Label',
  component: Label,
  args: { children: 'Email' },
  argTypes: {
    htmlFor: {
      description: '연결할 폼 컨트롤의 id. 라벨을 클릭하면 해당 컨트롤로 포커스가 이동한다.',
      control: 'text',
      table: { type: { summary: 'string' } }
    },
    children: {
      description: '라벨에 들어가는 텍스트나 노드.',
      control: 'text',
      table: { type: { summary: 'ReactNode' } }
    }
  }
}
export default meta
type Story = StoryObj<typeof Label>

/** 입력과 연결하지 않고 텍스트만 둔 형태. */
export const Default: Story = {}

/** htmlFor로 입력과 연결한 경우. 라벨을 누르면 입력으로 포커스가 이동한다. */
export const WithInput: Story = {
  render: () => (
    <div className='grid w-72 gap-2'>
      <Label htmlFor='email'>Email</Label>
      <Input id='email' placeholder='you@example.com' />
    </div>
  )
}
