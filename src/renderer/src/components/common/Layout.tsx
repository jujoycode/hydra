import { Outlet } from 'react-router-dom'
import { Container } from '@chakra-ui/react'
import { Navbar } from '@components/features/Navbar'

export function Layout(): JSX.Element {
  return (
    <Container p={0} minH='screen'>
      <Navbar />
      <Container mx='auto' px={4} pt={4}>
        <Outlet />
      </Container>
    </Container>
  )
}
