import { Dialog } from '@components/common/Dialog'
import { useDialogStore } from '@stores/dialogStore'

export function CreateProjectDialog() {
  const { createProjectModal, closeDialog } = useDialogStore()

  const content = <></>

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
