'use client'

import { useEffect } from 'react'
import { SignInProcess, useAuthStore } from '@stores/AuthStore'
import { Box, Text, Link } from '@chakra-ui/react'
import { PinInput } from '@components/ui/pin-input'
import { IpcChannel, AuthError } from '@interface/CoreInterface'
import { getEmptyArray } from '@utils/CommonUtil'
import { CommonConstant } from '@constants/CommonConstant'

export function OtpForm() {
  const { mail, otpToken, setOtpToken, setSessions, setSignInProcess, setProcessError } = useAuthStore()

  useEffect(() => {
    if (otpToken[5] !== CommonConstant.EMPTY_STRING) {
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
        email: mail,
        token: otpToken.join(CommonConstant.EMPTY_STRING),
        type: CommonConstant.TYPE.MAIL
      })

      // 2. 유저 정보 및 세션을 전역 객체로 세팅
      setSessions(data.session!)

      // 3. Storage 저장
      localStorage.setItem('session', JSON.stringify(data.session))

      return
    } catch (error) {
      setProcessError(error as AuthError)
    }
  }

  /**
   * resendOtpToken
   * @desc 사용자 이메일로 OTP Token 재발송
   */
  const resendOtpToken = () => {
    setOtpToken(getEmptyArray(6))
    setSignInProcess(SignInProcess.RESEND)
  }

  return (
    <>
      <Box mt={4}>
        <Text fontWeight='light' fontSize='sm' color='gray.500' mb={4}>
          Enther the OTP Token generated from the link
          <br /> sent to
          <Link variant='underline' ml={2} href={CommonConstant.URL.MAIL_PREFIX + mail.split('@')[1]}>
            {mail}
          </Link>
        </Text>
        <PinInput otp count={6} value={otpToken} onValueChange={(e) => setOtpToken(e.value)} />
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
