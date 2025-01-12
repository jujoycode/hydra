import { Input } from '@chakra-ui/react'
import { Field } from '@components/ui/field'
import { Dialog } from '@components/common/Dialog'
import { useDialogStore } from '@stores/dialogStore'

export function CreateProjectDialog() {
  const { createProjectModal, closeDialog } = useDialogStore()

  const content = (
    <>
      <Field label='Name' required helperText='Project name must be unique.'>
        <Input placeholder='Enter your own name' />
      </Field>
    </>
  )

  return (
    <Dialog
      title='Create Project'
      open={createProjectModal}
      setOpen={() => closeDialog('createProject')}
      content={content}
      actionButton={{ title: 'Save', onClick: () => {} }}
    />
  )
}
