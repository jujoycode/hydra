import { Button } from '@/atoms/Button'
import { DialogTemplate } from '@/templates/DialogTemplate'

interface AlertDialogProps {
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
   * 다이얼로그 설명
   */
  description?: string

  /**
   * 확인 버튼 텍스트
   * @default "확인"
   */
  confirmText?: string

  /**
   * 확인 버튼 클릭 핸들러
   */
  onConfirm?: () => void

  /**
   * 확인 버튼 변형 스타일
   * @default "default"
   */
  confirmVariant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'

  /**
   * 다이얼로그 내용
   */
  children?: React.ReactNode
}

export function AlertDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmText = '확인',
  onConfirm,
  confirmVariant = 'default',
  children
}: AlertDialogProps) {
  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm()
    }
    onOpenChange(false)
  }

  const dialogFooter = (
    <Button type='button' variant={confirmVariant} onClick={handleConfirm} className='ml-auto'>
      {confirmText}
    </Button>
  )

  return (
    <DialogTemplate
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      description={description}
      footer={dialogFooter}
    >
      {children}
    </DialogTemplate>
  )
}
