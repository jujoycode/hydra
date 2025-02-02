'use client'

import { useEffect } from 'react'
import { useIpcHandler } from '@hooks/useIpcHandler'
import { useAuthStore } from '@stores/authStore'
import { useSignInStore, SignInProcess } from '@stores/signInStore'
import { useProjectStore } from '@stores/projectStore'
import { Box, Text, Link } from '@chakra-ui/react'
import { PinInput } from '@components/ui/pin-input'
import { getEmptyArray } from '@utils/commonUtil'
import { CommonConstant } from '@constants/CommonConstant'
import { IpcChannel, AuthError } from '@interface/CoreInterface'

export function OtpForm() {
  const { setSessions, setUser } = useAuthStore().actions
  const { mail, otpToken, actions } = useSignInStore()
  const { setProject } = useProjectStore().actions
  const verifyOtpHandler = useIpcHandler(IpcChannel.AUTH_VERIFY_OTP_TOKEN)
  const openExternalUrlHandler = useIpcHandler(IpcChannel.SYSTEM_OPEN_EXTERNAL_URL)

  useEffect(() => {
    if (otpToken && otpToken[5] !== CommonConstant.EMPTY_STRING) {
      verifyOtpToken()
    }
  }, [otpToken])

  /**
   * verifyOtpToken
   * @desc main 프로세스로 OTP 인증 요청, 확인 후 성공 응답
   */
  const verifyOtpToken = async () => {
    try {
      // 1. main 프로세스로 OTP 인증 요청
      const { data, error } = await verifyOtpHandler({
        email: mail as string,
        token: otpToken!.join(CommonConstant.EMPTY_STRING),
        type: CommonConstant.TYPE.MAIL
      })

      if (error) {
        throw error
      }

      // 2. 세션 및 유저 정보를 전역 객체로 세팅
      setSessions(data.session)
      setUser(data.user)
      data.projects?.forEach((project) => setProject(project))

      // 3. 상태를 성공으로 변경
      actions.setSignInProcess(SignInProcess.SUCCESS)

      return
    } catch (error) {
      actions.setProcessError(error as AuthError)
    }
  }

  const callOpenExternalUrl = async (url: string) => {
    await openExternalUrlHandler({ url })
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
            onClick={async () => await callOpenExternalUrl(CommonConstant.URL.MAIL_PREFIX + mail.split('@')[1])}
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
