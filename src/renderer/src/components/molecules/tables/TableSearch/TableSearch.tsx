import type { Table } from '@tanstack/react-table'
import { Filter, Search, X } from 'lucide-react'
import React, { useState } from 'react'
import { Badge } from '@/atoms/Badge'
import { Button } from '@/atoms/Button'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/atoms/DropdownMenu'
import { Input } from '@/atoms/Input'
import { cn } from '@/lib/utils'

export interface FilterOption<TValue = string> {
  /** 필터링할 데이터 컬럼 이름 */
  column: string
  /** 선택 가능한 필터 옵션 배열 */
  options: TValue[]
  /** 옵션 레이블 변환 함수 */
  getLabel?: (value: TValue) => string
  /** 필터 그룹 제목 */
  title?: string
}

export interface SelectFilterOption {
  /** 필터 값 */
  value: string
  /** 표시될 레이블 */
  label: string
}

export interface TableSearchProps<TData> {
  /** TanStack Table 인스턴스 */
  table: Table<TData>
  /** 검색할 데이터 컬럼 */
  searchColumn?: string
  /** 검색창 플레이스홀더 */
  placeholder?: string
  /** 검색창 너비 클래스 */
  searchWidth?: string
  /** 추가 CSS 클래스 */
  className?: string
  /** 버튼 스타일 필터 옵션들 */
  filters?: FilterOption[]
  /** 필터 카운트 표시 여부 */
  showFiltersCount?: boolean
  /** 체크박스 스타일 필터 옵션들 */
  selectOptions?: {
    column: string
    title: string
    options: SelectFilterOption[]
  }[]
  /** 필터 변경 시 콜백 */
  onFilterChange?: (column: string, value: any) => void
}

/**
 * 테이블 검색 및 필터링 컴포넌트
 */
export function TableSearch<TData>({
  table,
  searchColumn,
  placeholder = 'Search...',
  searchWidth = 'w-60',
  className,
  filters,
  showFiltersCount = true,
  selectOptions,
  onFilterChange
}: TableSearchProps<TData>) {
  const [searchValue, setSearchValue] = useState('')
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({})

  // table이 null인 경우 기본값 처리
  if (!table) {
    return null
  }

  // 검색 입력 핸들러
  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchValue(value)

    if (searchColumn) {
      table.getColumn(searchColumn)?.setFilterValue(value)
    }
  }

  // 검색 초기화 핸들러
  const handleClearSearch = () => {
    setSearchValue('')
    if (searchColumn) {
      table.getColumn(searchColumn)?.setFilterValue('')
    }
  }

  // 필터 토글 핸들러
  const handleFilterToggle = (column: string, value: string) => {
    const currentFilters = activeFilters[column] || []
    let newFilters: string[]

    if (currentFilters.includes(value)) {
      newFilters = currentFilters.filter((v) => v !== value)
    } else {
      newFilters = [...currentFilters, value]
    }

    const newActiveFilters = {
      ...activeFilters,
      [column]: newFilters
    }

    setActiveFilters(newActiveFilters)

    // 컬럼 필터 설정
    table.getColumn(column)?.setFilterValue(newFilters.length ? newFilters : undefined)

    // 콜백 호출
    onFilterChange?.(column, newFilters)
  }

  // 드롭다운 필터 핸들러
  const handleDropdownFilterChange = (checked: boolean, column: string, value: string) => {
    const currentFilters = activeFilters[column] || []
    let newFilters: string[]

    if (checked) {
      newFilters = [...currentFilters, value]
    } else {
      newFilters = currentFilters.filter((v) => v !== value)
    }

    const newActiveFilters = {
      ...activeFilters,
      [column]: newFilters
    }

    setActiveFilters(newActiveFilters)

    // 컬럼 필터 설정
    table.getColumn(column)?.setFilterValue(newFilters.length ? newFilters : undefined)

    // 콜백 호출
    onFilterChange?.(column, newFilters)
  }

  // 필터 제거 핸들러
  const handleRemoveFilter = (column: string, value: string) => {
    const currentFilters = activeFilters[column] || []
    const newFilters = currentFilters.filter((v) => v !== value)

    const newActiveFilters = {
      ...activeFilters,
      [column]: newFilters
    }

    setActiveFilters(newActiveFilters)

    // 컬럼 필터 설정
    table.getColumn(column)?.setFilterValue(newFilters.length ? newFilters : undefined)

    // 콜백 호출
    onFilterChange?.(column, newFilters)
  }

  // 필터 개수 계산
  const activeFilterCount = Object.values(activeFilters).flat().length

  // 활성화된 필터 렌더링
  const renderActiveFilters = () => {
    const allFilters = Object.entries(activeFilters).flatMap(([column, values]) =>
      values.map((value) => ({ column, value }))
    )

    if (allFilters.length === 0) return null

    return (
      <div className='flex flex-wrap gap-1 mt-2'>
        {allFilters.map(({ column, value }) => {
          // 필터 옵션에서 라벨 가져오기
          let label = value
          const filterOption = filters?.find((f) => f.column === column)
          if (filterOption?.getLabel) {
            label = filterOption.getLabel(value)
          } else {
            // selectOptions에서 라벨 가져오기
            const selectOption = selectOptions?.find((s) => s.column === column)
            if (selectOption) {
              const option = selectOption.options.find((o) => o.value === value)
              if (option) {
                label = option.label
              }
            }
          }

          return (
            <Badge key={`${column}-${value}`} variant='outline' size='sm' className='flex items-center gap-1'>
              <span>{label}</span>
              <X size={12} className='cursor-pointer' onClick={() => handleRemoveFilter(column, value)} />
            </Badge>
          )
        })}
      </div>
    )
  }

  return (
    <div className={cn('space-y-2', className)}>
      <div className='flex flex-wrap items-center gap-2'>
        {/* 검색 인풋 */}
        <div className={cn('relative', searchWidth)}>
          <Search className='absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground' />
          <Input
            type='text'
            placeholder={placeholder}
            value={searchValue}
            onChange={handleSearchInput}
            className='pl-7 pr-7 h-8 text-xs'
          />
          {searchValue && (
            <X
              className='absolute right-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 cursor-pointer text-muted-foreground'
              onClick={handleClearSearch}
            />
          )}
        </div>

        {/* 버튼 필터 */}
        {filters && filters.length > 0 && (
          <div className='flex flex-wrap gap-1'>
            {filters.map((filter) => (
              <div key={filter.column} className='flex flex-col gap-1'>
                {filter.title && <span className='text-xs text-muted-foreground'>{filter.title}</span>}
                <div className='flex flex-wrap gap-1'>
                  {filter.options.map((option) => {
                    const value = option.toString()
                    const isActive = (activeFilters[filter.column] || []).includes(value)
                    const label = filter.getLabel ? filter.getLabel(option) : value

                    return (
                      <Button
                        key={value}
                        variant={isActive ? 'default' : 'outline'}
                        size='sm'
                        className={cn('h-7 text-xs', isActive && 'bg-primary text-primary-foreground')}
                        onClick={() => handleFilterToggle(filter.column, value)}
                      >
                        {label}
                      </Button>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 드롭다운 필터 */}
        {selectOptions && selectOptions.length > 0 && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='outline' size='sm' className='h-8 px-2 text-xs'>
                <Filter className='h-3.5 w-3.5 mr-1' />
                Filter
                {showFiltersCount && activeFilterCount > 0 && (
                  <Badge size='xs' className='ml-1 px-1.5 py-0 h-4'>
                    {activeFilterCount}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='start' className='w-48'>
              {selectOptions.map((option, i) => (
                <React.Fragment key={option.column}>
                  {i > 0 && <DropdownMenuSeparator />}
                  <DropdownMenuLabel className='text-xs'>{option.title}</DropdownMenuLabel>
                  {option.options.map((opt) => {
                    const isActive = (activeFilters[option.column] || []).includes(opt.value)

                    return (
                      <DropdownMenuCheckboxItem
                        key={opt.value}
                        checked={isActive}
                        onCheckedChange={(checked) => handleDropdownFilterChange(checked, option.column, opt.value)}
                        className='text-xs'
                      >
                        {opt.label}
                      </DropdownMenuCheckboxItem>
                    )
                  })}
                </React.Fragment>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      {/* 활성화된 필터 표시 */}
      {renderActiveFilters()}
    </div>
  )
}
