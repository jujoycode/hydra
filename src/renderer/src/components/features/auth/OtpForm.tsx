import { useAuthStore, SignInProcess } from '@stores/AuthStore'
import { Box, Text, Link } from '@chakra-ui/react'
import { PinInput } from '@components/ui/pin-input'
import { IpcChannel } from '@interface/CoreInterface'

export function OtpForm() {
  const { mail, otpToken, setOtpToken, setSignInProcess, setProcessError } = useAuthStore()

  /**
   * verifyOtpToken
   * @desc main 프로세스로 OTP 인증 요청, 확인 대기
   */
  const verifyOtpToken = async () => {
    // 1. main 프로세스로 OTP 인증 요청
    const { data, error } = await window.callApi(IpcChannel.AUTH_VERIFY_OTP_TOKEN, {
      email: mail,
      token: otpToken.join(),
      type: 'email'
    })

    // *. 에러 발생 시, 실패 처리
    if (error) {
      setSignInProcess(SignInProcess.FAILED)
      setProcessError(error)
    }

    console.log('user:', data.user)
    console.log('session:', data.session)

    // 2. 유저 정보 및 세션을 전역 객체로 세팅

    // 3. 로그인 완료 처리
    setSignInProcess(SignInProcess.SUCCEED)
  }

  return (
    <>
      <Box mt={4}>
        <Text fontWeight='light' fontSize='sm' color='gray.500' mb={4}>
          Enther the OTP Token generated from the link
          <br /> sent to
          <Link variant='underline' ml={2}>
            {mail}
          </Link>
        </Text>
        <PinInput
          otp
          count={6}
          value={otpToken}
          onValueChange={(e) => setOtpToken(e.value)}
          onValueComplete={async () => await verifyOtpToken()}
        />
        <Text fontWeight='light' fontSize='xs' colorPalette='green' mt={4}>
          Not seeing the email in your inbox?
          <Link variant='underline' ml={2}>
            Try sending again
          </Link>
        </Text>
      </Box>
    </>
  )
}
