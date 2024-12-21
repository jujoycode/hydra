'use client'

import { useEffect } from 'react'
import { useAuthStore, SignInProcess } from '@stores/AuthStore'
import { Center, Box, Text } from '@chakra-ui/react'
import { toaster } from '@components/ui/toaster'
import { WelcomeForm } from '@components/features/auth/WelcomForm'
import { OtpForm } from '@components/features/auth/OtpForm'
import { User } from '@interface/CoreInterface'

export function SignInPage() {
  const { session, signInProcess, processError, setClear } = useAuthStore()

  useEffect(() => {
    if (signInProcess === SignInProcess.FAILED) {
      signInFailed(processError)
    }

    if (signInProcess === SignInProcess.SUCCEED) {
      signInSucceed(session!.user)
    }
  }, [signInProcess])

  /**
   * signInFailed
   * @desc 프로세스 성공 시 실행되는 함수, toast 알림 및 경로 이동
   */
  const signInSucceed = (userInfo: User) => {
    toaster.create({
      type: 'success',
      title: `Welcome, ${userInfo.id}`
    })
  }

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

    setClear()
  }

  return (
    <Box p={0} w='full' h='100vh'>
      <Center w='1/2' h='full'>
        <Box w='3/5'>
          <Text fontWeight='semibold' fontSize='xl' color='gray.700'>
            Welcome to Hydra! 👋🏻
          </Text>

          {signInProcess === SignInProcess.WELCOME || SignInProcess.REQUEST ? <WelcomeForm /> : null}
          {signInProcess === SignInProcess.OTP_WAIT ? <OtpForm /> : null}
        </Box>
      </Center>
    </Box>
  )
}
