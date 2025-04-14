import React from 'react'

interface InfoRowProps {
  label: string
  value: React.ReactNode
  labelWidth?: 1 | 2 | 3 | 4
}

export function InfoRow({ label, value, labelWidth = 1 }: InfoRowProps) {
  const valueWidth = 4 - labelWidth

  return (
    <div className="grid grid-cols-4 items-center gap-4">
      <span className={`font-semibold col-span-${labelWidth}`}>{label}</span>
      <span className={`col-span-${valueWidth}`}>{value}</span>
    </div>
  )
}
