'use client'

import React, { useState } from 'react'
import { Input } from '@/atoms/Input'
import { Button } from '@/atoms/Button'
import { Checkbox } from '@/atoms/Checkbox'
import { Popover, PopoverContent, PopoverTrigger } from '@/atoms/Popover'
import { X, Search, ChevronDown } from 'lucide-react'
import type { TableSearchBarProps } from '@/types/table'

export function TableSearchBar<TData, TValue>({
  table,
  searchColumn = 'title',
  placeholder = 'Search by title...',
  className = '',
  selectOptions = [],
  searchWidth = 'w-full md:w-72'
}: TableSearchBarProps<TData, TValue>) {
  const [isSelectOpen, setIsSelectOpen] = useState<{ [key: string]: boolean }>({})
  const [searchValue, setSearchValue] = useState('')

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchValue(value)
    table.getColumn(searchColumn)?.setFilterValue(value)
  }

  // Clear search
  const clearSearch = () => {
    setSearchValue('')
    table.getColumn(searchColumn)?.setFilterValue('')
  }

  // Check if a select filter option is active
  const isSelectOptionActive = (column: string, value: string): boolean => {
    const filterValue = table.getColumn(column)?.getFilterValue() as string[] | undefined
    return Array.isArray(filterValue) && filterValue.includes(value)
  }

  // Toggle select filter option
  const toggleSelectOption = (column: string, value: string) => {
    const filterValue = table.getColumn(column)?.getFilterValue() as string[] | undefined

    if (Array.isArray(filterValue)) {
      const updatedFilter = filterValue.includes(value)
        ? filterValue.filter((val) => val !== value)
        : [...filterValue, value]

      table.getColumn(column)?.setFilterValue(updatedFilter.length ? updatedFilter : undefined)
    } else {
      table.getColumn(column)?.setFilterValue([value])
    }
  }

  // Get selected options count for a select filter
  const getSelectedOptionsCount = (column: string): number => {
    const filterValue = table.getColumn(column)?.getFilterValue() as string[] | undefined
    return Array.isArray(filterValue) ? filterValue.length : 0
  }

  // Toggle select dropdown
  const toggleSelectDropdown = (column: string) => {
    setIsSelectOpen((prev) => ({
      ...prev,
      [column]: !prev[column]
    }))
  }

  return (
    <div className={`flex gap-2 flex-wrap items-center ${className}`}>
      {/* Search Input */}
      <div className={`relative ${searchWidth}`}>
        <Input placeholder={placeholder} value={searchValue} onChange={handleSearchChange} className='pr-8 h-10' />
        {searchValue && (
          <button
            onClick={clearSearch}
            className='absolute right-8 top-0 h-full flex items-center px-2 text-gray-400 hover:text-gray-600'
          >
            <X className='h-4 w-4' />
          </button>
        )}
        <div className='absolute right-2 top-0 h-full flex items-center px-2 text-gray-400'>
          <Search className='h-4 w-4' />
        </div>
      </div>

      {/* Select Filters */}
      {selectOptions.map((selectOption, idx) => (
        <Popover
          key={`select-${idx}`}
          open={isSelectOpen[selectOption.column]}
          onOpenChange={(open) => setIsSelectOpen((prev) => ({ ...prev, [selectOption.column]: open }))}
        >
          <PopoverTrigger asChild>
            <Button
              variant='outline'
              className='flex items-center gap-1 h-10 whitespace-nowrap'
              onClick={() => toggleSelectDropdown(selectOption.column)}
            >
              {selectOption.title}
              <ChevronDown className='h-4 w-4 ml-1' />
            </Button>
          </PopoverTrigger>
          <PopoverContent className='w-[220px] p-0' align='start'>
            <div className='p-2'>
              <h4 className='text-sm font-medium px-2 py-1'>{selectOption.title}</h4>
              <div className='mt-2 space-y-1 max-h-[300px] overflow-y-auto'>
                {selectOption.options.map((option, optionIdx) => (
                  <label
                    key={`${selectOption.column}-${optionIdx}`}
                    className='flex items-center px-2 py-1.5 hover:bg-muted cursor-pointer rounded'
                  >
                    <Checkbox
                      checked={isSelectOptionActive(selectOption.column, option.value)}
                      onCheckedChange={() => toggleSelectOption(selectOption.column, option.value)}
                      className='mr-2'
                    />
                    <span className='text-sm'>{option.label}</span>
                  </label>
                ))}
              </div>

              {getSelectedOptionsCount(selectOption.column) > 0 && (
                <Button
                  variant='ghost'
                  size='sm'
                  onClick={() => table.getColumn(selectOption.column)?.setFilterValue(undefined)}
                  className='w-full mt-2 text-xs'
                >
                  Reset Filter
                </Button>
              )}
            </div>
          </PopoverContent>
        </Popover>
      ))}
    </div>
  )
}
