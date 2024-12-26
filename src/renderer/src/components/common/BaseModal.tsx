import {
  DialogRoot,
  DialogHeader,
  DialogTitle,
  DialogBody,
  DialogContent
  // DialogFooter,
  // DialogTrigger,
  // DialogCloseTrigger
} from '@components/ui/dialog'
import type { DialogRootProps, DialogContentProps } from '@chakra-ui/react'

export interface BaseModalProps extends Omit<DialogRootProps, 'children'> {
  title: string
  contentProps?: DialogContentProps
  children: React.ReactNode
}

export function BaseModal({ title, contentProps, children, ...modalProps }) {
  return (
    <DialogRoot {...modalProps}>
      <DialogContent {...contentProps}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <DialogBody>{children}</DialogBody>
      </DialogContent>
    </DialogRoot>
  )
}
