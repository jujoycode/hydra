import { useSupabase } from '@hooks/useSupabase'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { Container, Card } from '@chakra-ui/react'

export function LoginPage() {
  const supaClient = useSupabase()

  return (
    <Container p={0} h='100vh' flex={1} alignContent='center' justifyItems='center'>
      <Card.Root maxW='sm'>
        <Card.Header>
          <Card.Title>Login</Card.Title>
          <Card.Description>Fill in the form below to login a Hydra</Card.Description>
        </Card.Header>
        <Card.Body h='sm'>
          <Auth
            supabaseClient={supaClient}
            appearance={{ theme: ThemeSupa }}
            providers={['google', 'github']}
            socialLayout='horizontal'
          />
        </Card.Body>
        <Card.Footer justifyContent='flex-end'></Card.Footer>
      </Card.Root>
    </Container>
  )
}
