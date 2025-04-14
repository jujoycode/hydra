import { Issue } from './issue'

/**
 * 이슈 상세정보 다이얼로그 속성 인터페이스
 */
export interface IssueDetailsDialogProps {
  /** 표시할 이슈 (null이면 새 이슈 생성 모드) */
  issue: Issue | null
  /** 다이얼로그 열림 상태 */
  open: boolean
  /** 다이얼로그 열림 상태 변경 핸들러 */
  onOpenChange: (open: boolean) => void
  /** 편집/생성 모드 */
  mode?: 'view' | 'edit' | 'create'
  /** 저장 버튼 클릭 시 호출되는 함수 */
  onSave?: (issue: Issue) => void
} 