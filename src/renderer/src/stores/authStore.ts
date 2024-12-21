import { create } from 'zustand'
import { Session, User } from '@interface/CoreInterface'

export enum SignInProcess {
  WELCOME = 'welcome',
  REQUEST = 'request',
  RESEND = 'resend',
  OTP_WAIT = 'otpWait',
  FAILED = 'failed'
}

interface AuthStore {
  // State
  mail: string
  otpToken: string[]
  session?: Session
  user?: User
  signInProcess: SignInProcess

  processError?: Error

  // Actions
  setMail: (mail: string) => void
  setOtpToken: (otpToken: string[]) => void
  setSessions: (session?: Session) => void
  setUser: (user?: User) => void
  setSignInProcess: (signInProcess: SignInProcess) => void
  setProcessError: (processError?: Error) => void
}

export const useAuthStore = create<AuthStore>((set) => ({
  // State
  mail: '',
  otpToken: ['', '', '', '', '', ''],
  session: undefined,
  user: undefined,
  signInProcess: SignInProcess.WELCOME,
  processError: undefined,

  // Actions
  setMail: (mail) => set({ mail }),
  setOtpToken: (otpToken) => set({ otpToken }),
  setSessions: (session) => set({ session }),
  setUser: (user) => set({ user }),
  setSignInProcess: (signInProcess) => set({ signInProcess }),
  setProcessError: (processError) => set({ processError })
}))
