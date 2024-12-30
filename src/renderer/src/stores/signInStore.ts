import { create } from 'zustand'
import { createSelectors } from '@utils/zustand'
import { getEmptyArray } from '@utils/commonUtil'

export enum SignInProcess {
  WELCOME = 'welcome',
  REQUEST = 'request',
  RESEND = 'resend',
  OTP_WAIT = 'otpWait',
  FAILED = 'failed'
}

interface SignInStore {
  mail: string
  otpToken: string[]
  signInProcess: SignInProcess
  processError: Error | null

  actions: SignInAction
}

interface SignInAction {
  setMail: (mail: string) => void
  setOtpToken: (otpToken: string[]) => void
  setSignInProcess: (process: SignInProcess) => void
  setProcessError: (error: Error | null) => void
  resetSignIn: () => void
}

export const useSignInStoreBase = create<SignInStore>((set) => ({
  mail: '',
  otpToken: getEmptyArray(6),
  signInProcess: SignInProcess.WELCOME,
  processError: null,

  actions: {
    setMail: (mail) => set({ mail }),
    setOtpToken: (otpToken) => set({ otpToken }),
    setSignInProcess: (process) => set({ signInProcess: process }),
    setProcessError: (error) => set({ processError: error }),
    resetSignIn: () =>
      set({ mail: '', otpToken: ['', '', '', '', '', ''], signInProcess: SignInProcess.WELCOME, processError: null })
  }
}))

export const useSignInStore = createSelectors(useSignInStoreBase)
