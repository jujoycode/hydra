'use client'

import { useEffect } from 'react'
import { useAuthStore } from '@stores/authStore'
import { useSignInStore, SignInProcess } from '@stores/SignInStore'
import { Box, Text, Link } from '@chakra-ui/react'
import { PinInput } from '@components/ui/pin-input'
import { IpcChannel, AuthError } from '@interface/CoreInterface'
import { getEmptyArray } from '@utils/commonUtil'
import { CommonConstant } from '@constants/CommonConstant'

export function OtpForm() {
  const { setSessions } = useAuthStore().actions
  const { mail, otpToken, actions } = useSignInStore()

  useEffect(() => {
    if (otpToken && otpToken[5] !== CommonConstant.EMPTY_STRING) {
      verifyOtpToken()
    }
  }, [otpToken])

  /**
   * verifyOtpToken
   * @desc main 프로세스로 OTP 인증 요청, 확인 대기
   */
  const verifyOtpToken = async () => {
    try {
      // 1. main 프로세스로 OTP 인증 요청
      const { data } = await window.callApi(IpcChannel.AUTH_VERIFY_OTP_TOKEN, {
        email: mail as string,
        token: otpToken!.join(CommonConstant.EMPTY_STRING),
        type: CommonConstant.TYPE.MAIL
      })

      // 2. 유저 정보 및 세션을 전역 객체로 세팅
      setSessions(data.session!)

      // 3. Storage 저장
      localStorage.setItem('session', JSON.stringify(data.session))

      return
    } catch (error) {
      actions.setProcessError(error as AuthError)
    }
  }

  const callOpenExternalUrl = (url: string) => {
    window.callApi(IpcChannel.SYSTEM_OPEN_EXTERNAL_URL, { url })
  }

  /**
   * resendOtpToken
   * @desc 사용자 이메일로 OTP Token 재발송
   */
  const resendOtpToken = () => {
    actions.setOtpToken(getEmptyArray(6))
    actions.setSignInProcess(SignInProcess.RESEND)
  }

  return (
    <>
      <Box mt={4}>
        <Text fontWeight='light' fontSize='sm' color='gray.500' mb={4}>
          Enther the OTP Token generated from the link
          <br /> sent to
          <Link
            variant='underline'
            ml={2}
            onClick={() => callOpenExternalUrl(CommonConstant.URL.MAIL_PREFIX + mail.split('@')[1])}
          >
            {mail}
          </Link>
        </Text>
        <PinInput otp count={6} value={otpToken} onValueChange={(e) => actions.setOtpToken(e.value)} />
        <Text fontWeight='light' fontSize='xs' colorPalette='green' mt={4}>
          Not seeing the email in your inbox?
          <Link variant='underline' ml={2} onClick={() => resendOtpToken()}>
            Try sending again
          </Link>
        </Text>
      </Box>
    </>
  )
}
