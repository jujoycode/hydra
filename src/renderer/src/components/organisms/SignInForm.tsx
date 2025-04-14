import React, { useState } from 'react'
import { cn } from '@lib/utils'
import { Button } from '@atoms/Button'
import { Card, CardContent } from '@atoms/Card'
import { InputField } from '@molecules/InputField'

export function SignInForm({ className, ...props }: React.ComponentProps<'div'>) {
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [state, setState] = useState<'idle' | 'send-email' | 'idle-otp' | 'verify-otp' | 'success'>('idle')

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

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card className='overflow-hidden p-0'>
        <CardContent className='grid p-0 md:grid-cols-2'>
          <form className='p-6 md:p-8'>
            <div className='flex flex-col gap-6'>
              <div className='flex flex-col items-center text-center'>
                <h1 className='text-2xl font-bold'>Welcome back</h1>
                <p className='text-muted-foreground text-balance'>Login and manage your projects</p>
              </div>

              {(state === 'idle' || state === 'send-email') && (
                <>
                  <InputField.Email
                    label='Email'
                    placeholder='mail@example.com'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />

                  <Button
                    type='button'
                    className='w-full'
                    loading={state === 'send-email'}
                    onClick={handleSendEmailSubmit}
                  >
                    Sign In
                  </Button>
                </>
              )}

              {(state === 'idle-otp' || state === 'verify-otp') && (
                <>
                  <InputField label='Verification Code'>
                    <p className='text-sm text-muted-foreground mb-4'>
                      Enter the 6-digit code sent to{' '}
                      <a
                        href={getMailLink(email)}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='underline'
                      >
                        {email}
                      </a>
                    </p>
                    <InputField.OTP value={otp} maxLength={6} onChange={(value) => setOtp(value)} />
                  </InputField>

                  <Button
                    type='button'
                    className='w-full'
                    loading={state === 'verify-otp'}
                    onClick={handleVerifyOtpSubmit}
                  >
                    Verify
                  </Button>

                  <Button
                    type='button'
                    variant='link'
                    className='text-xs hover:underline text-center'
                    onClick={() => setState('idle')}
                  >
                    Resend code
                  </Button>
                </>
              )}
            </div>
          </form>

          <div className='bg-muted relative hidden md:block'>
            <img
              src='/empty-image.svg'
              alt='Image'
              className='absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale'
            />
          </div>
        </CardContent>
      </Card>

      <div className='text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4'>
        By clicking continue, you agree to our <a className='cursor-pointer'>Terms of Service</a> and{' '}
        <a className='cursor-pointer'>Privacy Policy</a>.
      </div>
    </div>
  )
}

function getMailLink(email: string): string {
  if (!email || !email.includes('@')) {
    return 'https://www.google.com'
  }

  const [, domainPart] = email.split('@')
  if (!domainPart) return 'https://www.google.com'

  const domainSegments = domainPart.split('.')
  const domain = domainSegments[0].toLowerCase()

  // 일반적인 무료 메일 서비스
  switch (domain) {
    case 'gmail':
      return 'https://mail.google.com'
    case 'naver':
      return 'https://mail.naver.com'
    case 'daum':
      return 'https://mail.daum.net'
    case 'kakao':
      return 'https://mail.kakao.com'
  }

  // 회사/기관 메일 및 기타 메일
  if (domainPart.includes('.')) {
    // 회사 메일 도메인 체크
    const tld = domainSegments[domainSegments.length - 1].toLowerCase()

    // Microsoft Exchange/Outlook 웹 접근 방식 시도
    if (['com', 'co', 'org', 'net', 'edu', 'gov', 'ac'].includes(tld)) {
      // 회사 메일은 대부분 Outlook Web Access나 Exchange를 사용하므로 해당 주소 패턴을 시도
      return `https://mail.${domainPart}`
    }
  }

  // 기본 검색 결과로 이동
  return `https://www.google.com/search?q=${encodeURIComponent(`${domainPart} webmail login`)}`
}
