import type { Table } from '@tanstack/react-table'

/**
 * 버튼 형태의 필터 옵션을 위한 인터페이스
 */
export interface FilterOption<TValue> {
  /** 필터링할 데이터 컬럼 이름 */
  column: string
  /** 선택 가능한 필터 옵션 배열 */
  options: TValue[]
  /** 옵션 레이블 변환 함수 */
  getLabel?: (value: TValue) => string
  /** 필터 그룹 제목 */
  title?: string
}

/**
 * 체크박스 형태의 필터 옵션을 위한 인터페이스
 */
export interface SelectFilterOption {
  /** 필터 값 */
  value: string
  /** 표시될 레이블 */
  label: string
}

/**
 * 테이블 검색바 컴포넌트의 속성 인터페이스
 */
export interface TableSearchBarProps<TData, TValue> {
  /** TanStack Table 인스턴스 */
  table: Table<TData>
  /** 검색할 데이터 컬럼 */
  searchColumn?: string
  /** 검색창 플레이스홀더 */
  placeholder?: string
  /** 추가 CSS 클래스 */
  className?: string
  /** 버튼 스타일 필터 옵션들 */
  filters?: FilterOption<TValue>[]
  /** 필터 카운트 표시 여부 */
  showFiltersCount?: boolean
  /** 체크박스 스타일 필터 옵션들 */
  selectOptions?: {
    column: string
    title: string
    options: SelectFilterOption[]
  }[]
  /** 검색창 너비 클래스 */
  searchWidth?: string
}

/**
 * 테이블 페이지네이션 컴포넌트의 속성 인터페이스
 */
export interface TablePaginationProps<TData> {
  /** TanStack Table 인스턴스 */
  table: Table<TData>
}

export interface ProjectTableMeta {
  onSelectProject: (project: any) => void
}
