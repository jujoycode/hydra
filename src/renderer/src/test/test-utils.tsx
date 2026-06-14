import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { type RenderOptions, render } from '@testing-library/react'
import { ThemeProvider } from 'next-themes'
import type { ReactElement, ReactNode } from 'react'
import { I18nextProvider } from 'react-i18next'
import i18n from '../locales'

// 테스트마다 캐시가 격리되도록 새 QueryClient를 만든다(재시도 off, 콘솔 에러 억제).
function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: { retry: false, staleTime: 0, gcTime: 0 },
      mutations: { retry: false }
    }
  })
}

interface ProvidersProps {
  children: ReactNode
  queryClient?: QueryClient
}

/**
 * 앱과 동일한 프로바이더 스택(Theme + Query + i18n)으로 children을 감싼다.
 * 커넥티드 컴포넌트(organisms/pages 등)를 테스트할 때 사용한다.
 * 라우터 훅(useParams/useNavigate)에 의존하는 컴포넌트는 별도 라우터 스텁이 필요하다.
 */
export function AppProviders({ children, queryClient = createTestQueryClient() }: ProvidersProps) {
  return (
    <ThemeProvider attribute='class' defaultTheme='light' enableSystem={false}>
      <QueryClientProvider client={queryClient}>
        <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
      </QueryClientProvider>
    </ThemeProvider>
  )
}

interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  queryClient?: QueryClient
}

/**
 * @testing-library/react의 render를 앱 프로바이더로 감싼 커스텀 render.
 * 사용법: `import { renderWithProviders } from '@/test/test-utils'`
 */
export function renderWithProviders(ui: ReactElement, options: CustomRenderOptions = {}) {
  const { queryClient, ...renderOptions } = options
  return render(ui, {
    wrapper: ({ children }) => <AppProviders queryClient={queryClient}>{children}</AppProviders>,
    ...renderOptions
  })
}

// @testing-library/react re-export — 테스트에서 단일 임포트 소스로 사용
export * from '@testing-library/react'
export { renderWithProviders as render }
