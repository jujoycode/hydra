import { useState } from 'react'
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
  setOpen: (open: { open: boolean }) => void

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
    onClick: () => void | Promise<void>
    disabled?: boolean
  }
}

export function Dialog({ title, open, setOpen, content, actionButton }: DialogProps) {
  const [loading, setLoading] = useState(false)

  const ActionButton = () => {
    const handleClick = async () => {
      setLoading(true)

      await actionButton?.onClick()

      setLoading(false)
    }

    if (!actionButton) return null
    return (
      <>
        <Button onClick={handleClick} loading={loading} disabled={actionButton.disabled}>
          {actionButton.title}
        </Button>
      </>
    )
  }

  return (
    <DialogRoot modal scrollBehavior='inside' open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <DialogBody>{content}</DialogBody>

        <DialogFooter>
          <Button variant='outline' onClick={() => setOpen({ open: false })}>
            Cancel
          </Button>
          <ActionButton />
        </DialogFooter>
      </DialogContent>
    </DialogRoot>
  )
}
