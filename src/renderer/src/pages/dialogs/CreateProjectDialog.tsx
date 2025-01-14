import { useState } from 'react'
import { Input } from '@chakra-ui/react'
import { Field } from '@components/ui/field'
import { Dialog } from '@components/common/Dialog'
import { useAuthStore } from '@stores/authStore'
import { useDialogStore } from '@stores/dialogStore'
import { IpcChannel } from '@interface/CoreInterface'

export function CreateProjectDialog() {
  const { user } = useAuthStore()
  const { createProjectModal, closeDialog } = useDialogStore()
  const [projectName, setProjectName] = useState('')

  const content = (
    <>
      <Field label='Name' required helperText='Project name must be unique.'>
        <Input placeholder='Enter your own name' value={projectName} onChange={(e) => setProjectName(e.target.value)} />
      </Field>
    </>
  )

  const callRequestCreateProject = () => {
    window.callApi(IpcChannel.PROJECT_CREATE, {
      userId: user?.id || '',
      projectName: projectName,
      projectDescription: ''
    })
  }

  return (
    <Dialog
      title='Create Project'
      open={createProjectModal}
      setOpen={() => closeDialog('createProject')}
      content={content}
      actionButton={{ title: 'Save', onClick: () => callRequestCreateProject() }}
    />
  )
}
