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
  const [description, setDescription] = useState('')

  const content = (
    <>
      <Field label='Name' required helperText='Project name must be unique.' mb={6}>
        <Input
          placeholder='Enter project name'
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          required
          size='md'
        />
      </Field>

      <Field label='Description' helperText='Brief description of your project' mb={4}>
        <Input
          placeholder='Enter project description'
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          size='md'
          variant='outline'
        />
      </Field>
    </>
  )

  const callRequestCreateProject = async () => {
    await window.callApi(IpcChannel.PROJECT_CREATE, {
      userId: user?.id || '',
      projectName: projectName,
      projectDescription: description
    })

    closeDialog('createProject')
  }

  return (
    <Dialog
      title='Create Project'
      open={createProjectModal}
      setOpen={() => closeDialog('createProject')}
      content={content}
      actionButton={{ title: 'Save', onClick: callRequestCreateProject, disabled: !projectName }}
    />
  )
}
