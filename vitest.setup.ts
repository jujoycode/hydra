// 렌더러(jsdom) 테스트 전역 설정 — jest-dom 매처 등록
import '@testing-library/jest-dom/vitest'

// jsdom에는 ResizeObserver가 없다 — recharts ResponsiveContainer 등 리사이즈 의존 컴포넌트 렌더용 폴리필
class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}

if (typeof globalThis.ResizeObserver === 'undefined') {
  globalThis.ResizeObserver = ResizeObserverMock as unknown as typeof ResizeObserver
}

// jsdom에는 matchMedia가 없다 — next-themes ThemeProvider 등 미디어쿼리 의존 컴포넌트 렌더용 폴리필
if (typeof window !== 'undefined' && typeof window.matchMedia !== 'function') {
  window.matchMedia = ((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false
  })) as unknown as typeof window.matchMedia
}
