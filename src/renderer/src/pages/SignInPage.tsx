import { useState } from 'react'
import { IpcChannel } from '@interface/CoreInterface'
import { Container, Box, Text, Input, Button } from '@chakra-ui/react'
import { InputGroup } from '@components/ui/input-group'
import { Mail } from 'lucide-react'
// import { PasswordInput } from '@components/ui/password-input'

export function SignInPage() {
  const [mail, setMail] = useState<string>('')

  async function signInWithOtp() {
    await window.callApi(IpcChannel.AUTH_SIGN_IN_WITH_OTP, { email: mail })
  }

  return (
    <Box p={0} w='100%' h='100vh' display='flex' flexDirection='row'>
      <Container w='60%' h='100%' m={0} p={0} bg='blackAlpha.800' />
      <Container w='40%' h='100%' m={0} p={0} alignContent='center' justifyItems='center'>
        <Box w='3/4'>
          <Text fontWeight='semibold' fontSize='xl' color='gray.700'>
            Welcome to Hydra! 👋🏻
          </Text>
          <Text fontWeight='light' fontSize='sm' color='gray.500'>
            Please sign-to your account and start the
            <br />
            manage issues
          </Text>

          <InputGroup mt={4} mb={2} w='100%' flex='1' startElement={<Mail size={16} />}>
            <Input
              size='md'
              borderRadius='md'
              placeholder='Email'
              value={mail}
              onChange={(e) => setMail(e.target.value)}
            />
          </InputGroup>
          {/* <PasswordInput size='md' borderRadius='md' placeholder='Password' /> */}

          <Button mt={4} size='md' w='100%' onClick={() => signInWithOtp()}>
            SIGN IN
          </Button>
        </Box>
      </Container>
    </Box>
  )
}
