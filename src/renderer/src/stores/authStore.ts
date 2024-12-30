import { create } from 'zustand'
import { createSelectors } from '@utils/zustand'
import type { Session, User } from '@interface/CoreInterface'

interface AuthStore {
  session: Session | null
  user: User | null
  actions: AuthAction
}

interface AuthAction {
  setSessions: (session: Session | null) => void
  setUser: (user: User | null) => void
  clearAuth: () => void
}

const useAuthStoreBase = create<AuthStore>((set) => ({
  session: null,
  user: {
    id: 'ccf48b1e-a5f9-4ad0-b97b-d6390d4fe307',
    email: 'jh.b.ryu@gmail.com',
    user_metadata: {
      name: '유주형'
    }
  } as unknown as User,

  actions: {
    setSessions: (session) => {
      set({ session })
      if (session) {
        localStorage.setItem('session', JSON.stringify(session))
        set({ user: session.user })
      } else {
        localStorage.removeItem('session')
        set({ user: null })
      }
    },

    setUser: (user) => set({ user }),

    clearAuth: () => {
      set({ session: null, user: null })
      localStorage.removeItem('session')
    }
  }
}))

export const useAuthStore = createSelectors(useAuthStoreBase)

/**
 * initializeSession
 * @desc 세션 초기화
 */
export const initializeSession = () => {
  const storageSession = localStorage.getItem('session')

  if (storageSession) {
    useAuthStore().actions.setSessions(JSON.parse(storageSession))
    return true
  }

  return false
}
