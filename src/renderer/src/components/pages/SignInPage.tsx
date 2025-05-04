import { useState } from 'react'
import { toast } from 'sonner'
import { useNavigate } from 'react-router'
import { useIpcHandler } from '@/hooks/use-ipc'
import { useAuthStore } from '@/stores/auth'
import { useProjectStore } from '@/stores/project'
import { EmailSignInForm } from '@/organisms/forms/EmailSignInForm'
import { OtpVerificationForm } from '@/organisms/forms/OtpVerificationForm'
import { SignInTemplate } from '@/templates/SignInTemplate'
import { IpcChannel } from '@/interface/CoreInterface'

type SignInState = 'idle' | 'send-email' | 'idle-otp' | 'verify-otp'

export default function SignInPage() {
  // state
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [state, setState] = useState<SignInState>('idle')

  // hooks
  const { setUser, setSession } = useAuthStore()
  const { setProjects } = useProjectStore()
  const navigate = useNavigate()

  // ipc
  const authSignInWithOtp = useIpcHandler(IpcChannel.AUTH_SIGN_IN_WITH_OTP)
  const authVerifyOtpToken = useIpcHandler(IpcChannel.AUTH_VERIFY_OTP_TOKEN)

  /**
   * handleSendEmailSubmit
   * @desc 이메일 전송 시 이메일 전송 상태 처리
   */
  async function handleSendEmailSubmit() {
    setState('send-email')

    const { error } = await authSignInWithOtp({ email })
    if (error) {
      console.error(error)
      throw new Error(error.message)
    }

    setState('idle-otp')
  }

  /**
   * handleVerifyOtpSubmit
   * @desc 이메일 전송 시 이메일 전송 상태 처리
   */
  async function handleVerifyOtpSubmit() {
    setState('verify-otp')

    const { data, error } = await authVerifyOtpToken({ type: 'email', email, token: otp })
    if (error) {
      console.error(error)
      throw new Error(error.message)
    }

    if (data) {
      setUser(data.user)
      setSession(data.session)
      setProjects(data.projects)
    }

    toast.success('Sign in successful')
    navigate('/')
  }

  /**
   * handleResendCode
   * @desc 이메일 재전송
   */
  async function handleResendCode() {
    await handleSendEmailSubmit()
  }

  return (
    <div className='flex h-screen w-full flex-col items-center justify-center'>
      <SignInTemplate className='w-full max-w-3xl'>
        {(state === 'idle' || state === 'send-email') && (
          <EmailSignInForm
            email={email}
            onEmailChange={setEmail}
            onSubmit={handleSendEmailSubmit}
            isLoading={state === 'send-email'}
          />
        )}

        {(state === 'idle-otp' || state === 'verify-otp') && (
          <OtpVerificationForm
            email={email}
            otp={otp}
            onOtpChange={setOtp}
            onSubmit={handleVerifyOtpSubmit}
            onResendCode={handleResendCode}
            isLoading={state === 'verify-otp'}
          />
        )}
      </SignInTemplate>
    </div>
  )
}
