import { create } from 'zustand'
import { Session } from '@interface/CoreInterface'

export enum SignInProcess {
  WELCOME = 'welcome',
  REQUEST = 'request',
  OTP_WAIT = 'otpWait',
  SUCCEED = 'succeed',
  FAILED = 'failed'
}

interface AuthStore {
  // State
  mail: string
  otpToken: string[]
  session?: Session
  signInProcess: SignInProcess

  processError?: Error

  // Actions
  setMail: (mail: string) => void
  setOtpToken: (otpToken: string[]) => void
  setSessions: (session?: Session) => void
  setSignInProcess: (signInProcess: SignInProcess) => void
  setProcessError: (processError?: Error) => void

  setClear: () => void
}

export const useAuthStore = create<AuthStore>((set) => ({
  // State
  mail: '',
  otpToken: ['', '', '', '', '', ''],
  session: undefined,
  signInProcess: SignInProcess.WELCOME,
  processError: undefined,

  // Actions
  setMail: (mail) => set({ mail }),
  setOtpToken: (otpToken) => set({ otpToken }),
  setSessions: (session) => set({ session }),
  setSignInProcess: (signInProcess) => set({ signInProcess }),
  setProcessError: (processError) => set({ processError }),

  setClear() {
    this.setMail('')
    this.setOtpToken(['', '', '', '', '', ''])
    this.setSessions(undefined)
    this.setSignInProcess(SignInProcess.WELCOME)
    this.setProcessError(undefined)
  }
}))
