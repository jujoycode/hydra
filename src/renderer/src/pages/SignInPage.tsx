'use client'

import { useEffect } from 'react'
import { useSignInStore, SignInProcess } from '@stores/SignInStore'
import { Center, Box, Text } from '@chakra-ui/react'
import { toaster } from '@components/ui/toaster'
import { WelcomeForm } from '@components/features/auth/WelcomForm'
import { OtpForm } from '@components/features/auth/OtpForm'
import { AuthError, IpcChannel } from '@interface/CoreInterface'

export function SignInPage() {
  const { mail, signInProcess, processError, actions } = useSignInStore()

  useEffect(() => {
    if (signInProcess === SignInProcess.REQUEST) signInRequest()
    if (signInProcess === SignInProcess.RESEND) signInRequest()

    if (processError !== null) verifyFailed()
  }, [signInProcess, processError])

  /**
   * verifyFailed
   * @desc 인증 실패 시 호출, toast로 실패 사유 안내
   */
  const verifyFailed = () => {
    toaster.error({
      title: (processError as AuthError).code,
      description: (processError as AuthError).message
    })

    actions.setProcessError(null)
  }

  /**
   * signInRequest
   * @desc main 프로세스로 로그인 요청, OTP 입력 대기
   */
  const signInRequest = async () => {
    // 1. login 요청 상태
    actions.setSignInProcess(SignInProcess.REQUEST)

    // 2. main 프로세스로 로그인 요청
    const { error } = await window.callApi(IpcChannel.AUTH_SIGN_IN_WITH_OTP, {
      email: mail as string
    })

    // *. 에러 발생 시, 실패 처리
    if (error) {
      actions.setProcessError(error)

      return
    }

    // 3. 요청 완료 처리 및 OTP 입력 대기
    actions.setSignInProcess(SignInProcess.OTP_WAIT)
  }

  return (
    <Box p={0} w='full' h='100vh'>
      <Center w='1/2' h='full'>
        <Box w='3/5'>
          <Text fontWeight='semibold' fontSize='xl' color='gray.700'>
            Welcome to Hydra! 👋🏻
          </Text>

          {signInProcess === SignInProcess.WELCOME && <WelcomeForm />}
          {signInProcess === SignInProcess.REQUEST && <WelcomeForm />}
          {signInProcess === SignInProcess.OTP_WAIT && <OtpForm />}
        </Box>
      </Center>
    </Box>
  )
}
