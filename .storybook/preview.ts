import type { Preview } from '@storybook/react'
import '../src/renderer/src/index.css'

const preview: Preview = {
  // 모든 스토리에 autodocs Docs 페이지를 자동 생성한다(컴포넌트 설명 + argTypes 표).
  tags: ['autodocs'],
  parameters: {
    controls: { matchers: { color: /(background|color)$/i, date: /Date$/i } }
  }
}

export default preview
