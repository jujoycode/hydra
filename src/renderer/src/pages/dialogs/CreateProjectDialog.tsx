import { useState } from 'react'
import { useIpcHandler } from '@hooks/useIpcHandler'
import { useAuthStore } from '@stores/authStore'
import { useDialogStore } from '@stores/dialogStore'
import { useProjectStore } from '@stores/projectStore'
import { Input } from '@chakra-ui/react'
import { Field } from '@components/ui/field'
import { Dialog } from '@components/common/Dialog'
import { IpcChannel } from '@interface/CoreInterface'

export function CreateProjectDialog() {
  const { user } = useAuthStore()
  const { createProjectModal, closeDialog } = useDialogStore()
  const { addProject } = useProjectStore().actions
  const [projectName, setProjectName] = useState<string>('')
  const createProjectHandler = useIpcHandler(IpcChannel.PROJECT_CREATE)

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
    </>
  )

  const callRequestCreateProject = async () => {
    const { data, error } = await createProjectHandler({ userId: user?.id || '', projectName: projectName })

    if (error) {
      return
    }

    addProject(data)
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
