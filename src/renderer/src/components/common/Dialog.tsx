import { Button } from '@components/ui/button'
import { DialogRoot, DialogHeader, DialogTitle, DialogBody, DialogContent, DialogFooter } from '@components/ui/dialog'

interface DialogProps {
  /**
   * title
   * @type string
   */
  title: string

  /**
   * open
   * @desc state
   */
  open: boolean

  /**
   * setOpen
   * @desc state setter
   */
  setOpen: () => void

  /**
   * content
   * @type React.ReactNode
   * @desc 주 컨텐츠
   */
  content: React.ReactNode

  /**
   * actionButton
   * @type React.ReactNode
   */
  actionButton?: {
    title: string
    onClick: () => void
  }
}

export function Dialog({ title, open, setOpen, content, actionButton }: DialogProps) {
  return (
    <DialogRoot modal scrollBehavior='inside' open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <DialogBody>{content}</DialogBody>

        <DialogFooter>
          <Button variant='outline'>Cancel</Button>
          {actionButton && <Button onClick={actionButton.onClick}>{actionButton.title}</Button>}
        </DialogFooter>
      </DialogContent>
    </DialogRoot>
  )
}
