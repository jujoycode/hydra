import { Dialog } from '@components/common/Dialog'
import { Field } from '@components/ui/field'
import { useDialogStore } from '@stores/dialogStore'

export function CreateIssueDialog() {
  const { createIssueModal, closeDialog } = useDialogStore()

  const content = (
    <>
      <Field label='Name' required helperText='Project name must be unique.' mb={6}></Field>
    </>
  )

  return (
    <Dialog
      title='Create'
      open={createIssueModal}
      setOpen={() => closeDialog('createIssue')}
      content={content}
      actionButton={{ title: 'Create', onClick: () => {}, disabled: false }}
    />
  )
}
