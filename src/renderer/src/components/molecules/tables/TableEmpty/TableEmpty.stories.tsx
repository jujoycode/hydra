import type { Meta, StoryObj } from '@storybook/react'
import { TableEmpty } from './TableEmpty'

/**
 * 테이블에 표시할 데이터가 없거나 로딩 중일 때 보여주는 상태 컴포넌트.
 * 기본 아이콘(ClipboardList) + 메시지를 가운데 정렬로 렌더하며, `isLoading`이면
 * pulse 애니메이션과 함께 `loadingMessage`를 표시한다. 빈 상태에서는 `description`을 추가로 보여준다.
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
      description: '빈 상태일 때 표시되는 주 메시지',
      control: 'text',
      table: { type: { summary: 'string' }, defaultValue: { summary: 'No data available' } }
    },
    description: {
      description: '빈 상태에서 메시지 아래에 표시되는 보조 설명(선택)',
      control: 'text',
      table: { type: { summary: 'string' } }
    },
    icon: {
      description: '기본 아이콘 대신 사용할 아이콘(ReactNode). 미지정 시 ClipboardList 사용.',
      control: false,
      table: { type: { summary: 'ReactNode' } }
    },
    isLoading: {
      description: 'true이면 pulse 애니메이션과 loadingMessage를 표시한다.',
      control: 'boolean',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } }
    },
    loadingMessage: {
      description: '로딩 중 표시되는 메시지',
      control: 'text',
      table: { type: { summary: 'string' }, defaultValue: { summary: 'Loading data...' } }
    },
    className: {
      description: '컨테이너에 합쳐지는 추가 클래스',
      control: 'text',
      table: { type: { summary: 'string' } }
    }
  }
}
export default meta
type Story = StoryObj<typeof TableEmpty>

/** 메시지 + 설명이 있는 빈 상태. */
export const Empty: Story = {
  args: { message: 'No issues found', description: 'Create your first issue to get started' }
}

/** 데이터를 불러오는 중인 로딩 상태. */
export const Loading: Story = { args: { isLoading: true } }
