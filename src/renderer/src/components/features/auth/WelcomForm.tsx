'use client'

import { SignInProcess, useAuthStore } from '@stores/AuthStore'
import { isEmpty } from '@utils/CommonUtil'
import { Input, Text } from '@chakra-ui/react'
import { InputGroup } from '@components/ui/input-group'
import { Button } from '@components/ui/button'
import { Mail } from 'lucide-react'

export function WelcomeForm() {
  const { mail, signInProcess, setMail, setSignInProcess } = useAuthStore()

  return (
    <>
      <Text fontWeight='light' fontSize='sm' color='gray.500'>
        Please sign-to your mail and start the
        <br />
        manage issues
      </Text>

      <InputGroup mt={4} mb={2} w='full' startElement={<Mail size={16} />}>
        <Input size='md' borderRadius='md' placeholder='Email' value={mail} onChange={(e) => setMail(e.target.value)} />
      </InputGroup>

      <Button
        size='md'
        mt={4}
        w='full'
        disabled={isEmpty(mail)}
        loading={signInProcess === SignInProcess.REQUEST}
        onClick={() => setSignInProcess(SignInProcess.REQUEST)}
      >
        SIGN IN
      </Button>
    </>
  )
}
