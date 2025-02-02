'use client'

import { useNavigate } from 'react-router-dom'
import { useProjectStore } from '@stores/projectStore'
import { useDialogStore } from '@stores/dialogStore'
import { Box, Flex, HStack, Text } from '@chakra-ui/react'
import { Button } from '@components/ui/button'
import { Popover } from '@components/common/Popover'
import { Profile } from '@components/features/nav/Profile'
import { ChevronDown, UserRoundPlus } from 'lucide-react'
import { CreateProjectDialog } from '@pages/dialogs/CreateProjectDialog'

export function TopNavigation(): JSX.Element {
  const navigate = useNavigate()
  const { projectsMap } = useProjectStore()
  const { openDialog } = useDialogStore()

  const projectList = Array.from(projectsMap).map(([id, project]) => ({
    label: project.project_name,
    onClick: () => navigate(`projects/${id}`)
  }))

  const ProjectPopoverButton = () => {
    return (
      <>
        <Popover
          trigger={
            <Button variant='plain'>
              Projects <ChevronDown />
            </Button>
          }
          content={{
            main: projectList,
            footer: [
              { label: 'view all projects', onClick: () => navigate('/projects/list') },
              {
                label: 'create new project',
                onClick: () => openDialog('createProject')
              }
            ]
          }}
        />
        <CreateProjectDialog />
      </>
    )
  }

  const MemberPopoverButton = () => {
    return (
      <Popover
        trigger={
          <Button variant='plain'>
            Members <ChevronDown />
          </Button>
        }
        content={{ main: [{ label: 'invite', component: <UserRoundPlus size={18} strokeWidth={1.5} /> }] }}
      />
    )
  }

  return (
    <Box as='nav' px={4} w='full' shadow='sm'>
      <Flex h={16} alignItems='center' justifyContent='space-between' maxW='7xl' mx='auto'>
        <HStack gap={8}>
          <Box marginLeft={4} marginRight={4}>
            <Text fontSize='xl' fontWeight='semibold' onClick={() => navigate('/')} cursor='pointer'>
              Hydra
            </Text>
          </Box>

          <HStack gap={2}>
            <ProjectPopoverButton />
            <MemberPopoverButton />

            <Button size='sm'>Create</Button>
          </HStack>
        </HStack>

        <HStack>
          <Profile />
        </HStack>
      </Flex>
    </Box>
  )
}
