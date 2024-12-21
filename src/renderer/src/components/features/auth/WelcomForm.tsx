import { SignInProcess, useAuthStore } from '@stores/AuthStore'
import { isEmpty } from '@utils/CommonUtil'
import { Input, Text } from '@chakra-ui/react'
import { InputGroup } from '@components/ui/input-group'
import { Button } from '@components/ui/button'
import { Mail } from 'lucide-react'
import { IpcChannel } from '@interface/CoreInterface'

export function WelcomeForm() {
  const { signInProcess, setSignInProcess, setProcessError, mail, setMail } = useAuthStore()

  /**
   * signInRequest
   * @desc main 프로세스로 로그인 요청, OTP 입력 대기
   */
  const signInRequest = async () => {
    // 1. login 요청 상태
    setSignInProcess(SignInProcess.REQUEST)

    // 2. main 프로세스로 로그인 요청
    const { error } = await window.callApi(IpcChannel.AUTH_SIGN_IN_WITH_OTP, {
      email: mail!
    })

    // *. 에러 발생 시, 실패 처리
    if (error) {
      setSignInProcess(SignInProcess.FAILED)
      setProcessError(error)
    }

    // 3. 요청 완료 처리 및 OTP 입력 대기
    setSignInProcess(SignInProcess.OTP_WAIT)
  }

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
        onClick={async () => await signInRequest()}
      >
        SIGN IN
      </Button>
    </>
  )
}
