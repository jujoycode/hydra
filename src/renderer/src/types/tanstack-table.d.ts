import '@tanstack/react-table'

declare module '@tanstack/react-table' {
  // biome-ignore lint/correctness/noUnusedVariables: required for module augmentation
  interface ColumnMeta<TData extends RowData, TValue> {
    align?: 'left' | 'center' | 'right'
    width?: string
    initSorting?: (table: any) => void
    [key: string]: unknown
  }
}
