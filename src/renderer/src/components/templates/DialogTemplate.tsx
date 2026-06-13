import type React from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/atoms/Dialog'

interface DialogTemplateProps {
  /**
   * 다이얼로그 열림/닫힘 상태
   */
  open: boolean

  /**
   * 다이얼로그 상태 변경 핸들러
   */
  onOpenChange: (open: boolean) => void

  /**
   * 다이얼로그 제목
   */
  title: string

  /**
   * 다이얼로그 설명 (선택사항)
   */
  description?: string

  /**
   * 다이얼로그 컨텐츠 영역
   */
  children: React.ReactNode

  /**
   * 다이얼로그 푸터 영역 (버튼 등)
   */
  footer: React.ReactNode

  /**
   * 다이얼로그 최대 너비 클래스
   * @default "sm:max-w-[425px]"
   */
  maxWidthClass?: string

  /**
   * 폼 제출 핸들러 (폼을 사용하는 경우)
   */
  onSubmit?: (e: React.FormEvent) => void
}

export function DialogTemplate({
  open,
  onOpenChange,
  title,
  description,
  children,
  footer,
  maxWidthClass = 'sm:max-w-[425px]',
  onSubmit
}: DialogTemplateProps) {
  const content = (
    <DialogContent className={maxWidthClass}>
      <DialogHeader>
        <DialogTitle>{title}</DialogTitle>
        {description && <DialogDescription>{description}</DialogDescription>}
      </DialogHeader>

      {onSubmit ? (
        <form onSubmit={onSubmit}>
          <div className='py-4'>{children}</div>
          <DialogFooter>{footer}</DialogFooter>
        </form>
      ) : (
        <>
          <div className='py-4'>{children}</div>
          <DialogFooter>{footer}</DialogFooter>
        </>
      )}
    </DialogContent>
  )

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {content}
    </Dialog>
  )
}
