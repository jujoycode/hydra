'use client'

import { useState, useEffect } from 'react'
import { isEmpty } from '@utils/CommonUtil'
import { IpcChannel } from '@interface/CoreInterface'
import { Center, Box, Text, Input, Link, Show } from '@chakra-ui/react'
import { Button } from '@components/ui/button'
import { InputGroup } from '@components/ui/input-group'
import { PinInput } from '@components/ui/pin-input'
import { toaster } from '@components/ui/toaster'
import { PopoverRoot, PopoverTrigger, PopoverContent, PopoverArrow, PopoverBody } from '@components/ui/popover'
import { Mail } from 'lucide-react'

export function SignInPage() {
  const [mail, setMail] = useState<string>('')
  const [isLoginRequest, setIsLoginRequest] = useState(false)
  const [showOtpPopover, setShowOtpPopover] = useState(false)
  const [otp, setOtp] = useState(['', '', '', ''])

  useEffect(() => {
    setOtp(['', '', '', ''])
  }, [showOtpPopover])

  /**
   * signInFailed
   * @desc 프로세스 실패 시 실행되는 함수, 전체 상태 초기화 및 toast 알림
   */
  const signInFailed = (error: any) => {
    toaster.create({
      type: 'error',
      title: error.code,
      description: error.message
    })

    setMail('')
    setIsLoginRequest(false)
    setShowOtpPopover(false)
    setOtp(['', '', '', ''])
  }

  /**
   * signInRequest
   * @desc main 프로세스로 로그인 요청, OTP 입력 대기
   */
  const signInRequest = async () => {
    // 1. login 요청 상태
    setIsLoginRequest(true)

    // 2. main 프로세스로 로그인 요청
    const { error } = await window.callApi(IpcChannel.AUTH_SIGN_IN_WITH_OTP, {
      email: mail!
    })

    // *. 에러 발생 시, 실패 처리
    if (error) {
      signInFailed(error)
    }

    // 3. 요청이 성공했다면, 유저의 OTP 입력 대기
    setShowOtpPopover(true)
  }

  return (
    <Box p={0} w='full' h='100vh'>
      <Center w='1/2' h='full'>
        <Box w='3/5'>
          <Text fontWeight='semibold' fontSize='xl' color='gray.700'>
            Welcome to Hydra! 👋🏻
          </Text>
          <Text fontWeight='light' fontSize='sm' color='gray.500'>
            Please sign-to your account and start the
            <br />
            manage issues
          </Text>

          <InputGroup mt={4} mb={2} w='full' startElement={<Mail size={16} />}>
            <Input
              size='md'
              borderRadius='md'
              placeholder='Email'
              value={mail}
              onChange={(e) => setMail(e.target.value)}
            />
          </InputGroup>

          <PopoverRoot open={showOtpPopover} onOpenChange={(e) => setShowOtpPopover(e.open)}>
            <PopoverTrigger asChild w='full' mt={4}>
              <Button
                size='md'
                disabled={isEmpty(mail)}
                loading={isLoginRequest && showOtpPopover}
                onClick={async () => await signInRequest()}
              >
                SIGN IN
              </Button>
            </PopoverTrigger>
            <PopoverContent w='auto'>
              <PopoverArrow />
              <PopoverBody>
                <PinInput otp value={otp} onValueChange={(e) => setOtp(e.value)} />
              </PopoverBody>
            </PopoverContent>
          </PopoverRoot>

          <Show when={isLoginRequest}>
            <Center mt={2}>
              <Link variant='underline' fontSize='xs' onClick={() => setShowOtpPopover(true)}>
                enter otp
              </Link>
            </Center>
          </Show>
        </Box>
      </Center>
    </Box>
  )
}
