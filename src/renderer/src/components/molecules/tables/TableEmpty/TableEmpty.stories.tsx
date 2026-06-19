import type { Meta, StoryObj } from '@storybook/react'
import { TableEmpty } from './TableEmpty'

/**
 * 테이블에 표시할 데이터가 없거나 로딩 중일 때 그 영역을 채우는 컴포넌트다. 기본 아이콘인
 * ClipboardList와 메시지를 가운데로 모아 표시한다. isLoading일 때는 pulse 애니메이션과 함께 loadingMessage를
 * 표시하고, 빈 상태일 때는 description을 한 줄 더 표시한다.
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
      description: '빈 상태에서 표시할 메인 문구.',
      control: 'text',
      table: { type: { summary: 'string' }, defaultValue: { summary: 'No data available' } }
    },
    description: {
      description: '빈 상태에서 메시지 아래에 표시하는 설명. 선택 사항이다.',
      control: 'text',
      table: { type: { summary: 'string' } }
    },
    icon: {
      description: '기본 아이콘 대신 사용할 아이콘. 지정하지 않으면 ClipboardList를 표시한다.',
      control: false,
      table: { type: { summary: 'ReactNode' } }
    },
    isLoading: {
      description: '활성화하면 pulse 애니메이션과 loadingMessage로 전환한다.',
      control: 'boolean',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } }
    },
    loadingMessage: {
      description: '로딩 중에 표시할 문구.',
      control: 'text',
      table: { type: { summary: 'string' }, defaultValue: { summary: 'Loading data...' } }
    },
    className: {
      description: '컨테이너에 추가할 클래스.',
      control: 'text',
      table: { type: { summary: 'string' } }
    }
  }
}
export default meta
type Story = StoryObj<typeof TableEmpty>

/** 메시지와 설명을 함께 표시하는 빈 상태. */
export const Empty: Story = {
  args: { message: 'No issues found', description: 'Create your first issue to get started' }
}

/** 데이터를 불러오는 중인 상태. */
export const Loading: Story = { args: { isLoading: true } }
