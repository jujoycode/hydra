import { IssueState } from '@/molecules/IssueBadge'

/**
 * 이슈 아이템을 나타내는 인터페이스
 */
export interface Issue {
  /** 이슈의 고유 식별자 */
  id: string
  /** 이슈 종류 (버그 또는 기능) */
  category: 'bug' | 'feature'
  /** 이슈 키 (예: HYDRA-123) */
  key: string
  /** 이슈 제목 */
  title: string
  /** 이슈 생성 날짜 */
  created: Date
  /** 마지막 업데이트 날짜 */
  updated: Date
  /** 이슈 보고자 정보 */
  reporter: {
    /** 보고자 이름 */
    name: string
    /** 보고자 아바타 이미지 URL */
    avatar: string
    /** 보고자 이메일 (선택사항) */
    email?: string
  }
  /** 담당자 이름 */
  assignee: string
  /** 이슈 상태 */
  state: IssueState
  /** 이슈 설명 (선택사항) */
  description?: string
  /** 이슈 우선순위 (선택사항) */
  priority?: 'low' | 'medium' | 'high'
  /** 이슈 태그 목록 (선택사항) */
  tags?: string[]
}

/** 이슈 카테고리 타입 */
export type IssueCategory = Issue['category']

/** 이슈 우선순위 타입 (null/undefined 제외) */
export type IssuePriority = NonNullable<Issue['priority']>

/**
 * TanStack Table의 메타 속성에 사용되는 이슈 테이블 메타 인터페이스
 */
export interface IssueTableMeta {
  /** 이슈 선택 시 호출되는 함수 */
  onSelectIssue: (issue: Issue) => void
}
