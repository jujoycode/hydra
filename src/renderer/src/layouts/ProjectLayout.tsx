import { Outlet } from 'react-router-dom'
import { Flex, Container } from '@chakra-ui/react'
import { ProjectSidebar } from '@components/features/ProjectSidebar'

export function ProjectLayout() {
  return (
    <Flex>
      <ProjectSidebar />

      <Container>
        <Outlet />
      </Container>
    </Flex>
  )
}
