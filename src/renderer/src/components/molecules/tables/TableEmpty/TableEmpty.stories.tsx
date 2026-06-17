import type { Meta, StoryObj } from '@storybook/react'
import { TableEmpty } from './TableEmpty'

/**
 * 테이블에 보여줄 데이터가 없거나 아직 불러오는 중일 때 그 자리를 채우는 컴포넌트다. 기본 아이콘인
 * ClipboardList와 메시지를 가운데로 모아 띄운다. isLoading이면 pulse 애니메이션과 함께 loadingMessage를
 * 보여주고, 그냥 비어 있을 때는 description까지 한 줄 더 붙는다.
 */
const meta: Meta<typeof TableEmpty> = {
  title: 'Molecules/TableEmpty',
  component: TableEmpty,
  decorators: [
    (Story) => (
      <div className='w-96 rounded-lg border'>
        <Story />
      </div>
    )
  ],
  argTypes: {
    message: {
      description: '비어 있을 때 보여줄 메인 문구.',
      control: 'text',
      table: { type: { summary: 'string' }, defaultValue: { summary: 'No data available' } }
    },
    description: {
      description: '빈 상태에서 메시지 아래 덧붙는 설명. 없어도 된다.',
      control: 'text',
      table: { type: { summary: 'string' } }
    },
    icon: {
      description: '기본 아이콘 대신 쓸 아이콘. 안 주면 ClipboardList가 나온다.',
      control: false,
      table: { type: { summary: 'ReactNode' } }
    },
    isLoading: {
      description: '켜면 pulse 애니메이션과 loadingMessage로 바뀐다.',
      control: 'boolean',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } }
    },
    loadingMessage: {
      description: '불러오는 동안 보여줄 문구.',
      control: 'text',
      table: { type: { summary: 'string' }, defaultValue: { summary: 'Loading data...' } }
    },
    className: {
      description: '컨테이너에 덧붙일 클래스.',
      control: 'text',
      table: { type: { summary: 'string' } }
    }
  }
}
export default meta
type Story = StoryObj<typeof TableEmpty>

/** 메시지와 설명이 같이 있는 빈 상태. */
export const Empty: Story = {
  args: { message: 'No issues found', description: 'Create your first issue to get started' }
}

/** 아직 데이터를 받아오는 중일 때. */
export const Loading: Story = { args: { isLoading: true } }
