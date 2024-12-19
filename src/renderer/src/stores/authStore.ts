import { create } from 'zustand'

interface Session {}

interface AuthStore {
  // State
  session?: Session

  // Actions
  // setSessions: (session: Session) => void
}

export const useAuthStore = create<AuthStore>((_) => ({
  // State
  session: undefined
  // Actions
  // setSessions: set({ session })
}))
