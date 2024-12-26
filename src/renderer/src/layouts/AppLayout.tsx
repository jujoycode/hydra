import { Outlet } from 'react-router-dom'
import { Container } from '@chakra-ui/react'
import { TopNavigation } from '@components/features/nav/TobNavigation'

export function AppLayout(): JSX.Element {
  return (
    <Container p={0} minH='screen'>
      <TopNavigation />
      <Container mx='auto' px={4} pt={4}>
        <Outlet />
      </Container>
    </Container>
  )
}
