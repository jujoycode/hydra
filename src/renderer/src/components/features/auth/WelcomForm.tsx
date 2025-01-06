'use client'

import { SignInProcess, useSignInStore } from '@stores/SignInStore'
import { isEmpty } from '@utils/commonUtil'
import { Input, Text } from '@chakra-ui/react'
import { InputGroup } from '@components/ui/input-group'
import { Button } from '@components/ui/button'
import { Mail } from 'lucide-react'

export function WelcomeForm() {
  const { mail, signInProcess, actions } = useSignInStore()

  return (
    <>
      <Text fontWeight='light' fontSize='sm' color='gray.500'>
        Please sign-to your mail and start the
        <br />
        manage issues
      </Text>

      <InputGroup mt={4} mb={2} w='full' startElement={<Mail size={16} />}>
        <Input
          size='md'
          borderRadius='md'
          placeholder='Email'
          value={mail}
          onChange={(e) => actions.setMail(e.target.value)}
        />
      </InputGroup>

      <Button
        size='md'
        mt={4}
        w='full'
        disabled={isEmpty(mail)}
        loading={signInProcess === SignInProcess.REQUEST}
        onClick={() => actions.setSignInProcess(SignInProcess.REQUEST)}
      >
        SIGN IN
      </Button>
    </>
  )
}
