import { useState } from 'react'
import { EmailSignInForm } from '@/organisms/EmailSignInForm'
import { OtpVerificationForm } from '@/organisms/OtpVerificationForm'
import { SignInTemplate } from '@/templates/SignInTemplate'

type SignInState = 'idle' | 'send-email' | 'idle-otp' | 'verify-otp' | 'success'

export default function SignInPage() {
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [state, setState] = useState<SignInState>('idle')

  async function handleSendEmailSubmit() {
    setState('send-email')
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setState('idle-otp')
  }

  async function handleVerifyOtpSubmit() {
    setState('verify-otp')
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setState('success')
  }

  function handleResendCode() {
    setState('idle')
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

        {state === 'success' && (
          <div className='flex flex-col items-center justify-center py-8 text-center'>
            <h2 className='text-2xl font-bold'>Login Successful</h2>
            <p className='text-muted-foreground mt-2'>You are now logged in.</p>
          </div>
        )}
      </SignInTemplate>
    </div>
  )
}
