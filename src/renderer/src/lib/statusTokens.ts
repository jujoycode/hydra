import type { IssueState } from '@/molecules/issues/IssueBadge'
import type { IssuePriority } from '@/types/issue'

/**
 * 시맨틱 토큰 단일 진입점 (design-system §4.6 / design-tokens-spec §5).
 *
 * - 동적 `bg-status-${value}` 합성은 Tailwind purge에서 누락되므로 정적 매핑을 둔다.
 * - 상태 배지 = 틴트 배경(bg-status-*) + 진한 동계열 텍스트(text-status-*-fg). raw 색/`text-white` 금지.
 */
export const STATUS_CLASS: Record<IssueState, string> = {
  backlog: 'bg-status-backlog text-status-backlog-fg',
  in_progress: 'bg-status-in-progress text-status-in-progress-fg',
  review: 'bg-status-review text-status-review-fg',
  done: 'bg-status-done text-status-done-fg',
  blocked: 'bg-status-blocked text-status-blocked-fg'
} as const

/** 상태 한국어 라벨 (비-React 컨텍스트 정적 폴백) */
export const STATUS_LABEL: Record<IssueState, string> = {
  backlog: '대기',
  in_progress: '진행 중',
  review: '검토',
  done: '완료',
  blocked: '차단'
} as const

/** 우선순위 텍스트/아이콘 색 (urgent 포함 — types/issue.ts) */
export const PRIORITY_CLASS: Record<IssuePriority, string> = {
  urgent: 'text-priority-urgent',
  high: 'text-priority-high',
  medium: 'text-priority-medium',
  low: 'text-priority-low'
} as const

/** 우선순위 한국어 라벨 (비-React 컨텍스트 정적 폴백) */
export const PRIORITY_LABEL: Record<IssuePriority, string> = {
  urgent: '긴급',
  high: '높음',
  medium: '보통',
  low: '낮음'
} as const

/**
 * 런타임 prop으로 색을 넘겨야 하는 곳(recharts 등)에서 토큰 실제 값을 읽는다.
 * 라이트/다크/테마 전환을 자동 추종한다.
 */
export const getCssVar = (token: string): string =>
  getComputedStyle(document.documentElement).getPropertyValue(token).trim()
