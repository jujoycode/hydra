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
  user: null,

  actions: {
    setSessions: (session) => {
      set({ session })

      if (session) {
        localStorage.setItem('session', JSON.stringify(session))
      } else {
        localStorage.removeItem('session')
      }
    },

    setUser: (user) => {
      set({ user })

      if (user) {
        localStorage.setItem('user', JSON.stringify(user))
      } else {
        localStorage.removeItem('user')
      }
    },

    clearAuth: () => {
      set({ session: null, user: null })

      localStorage.removeItem('session')
      localStorage.removeItem('user')
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
  const storageUser = localStorage.getItem('user')

  if (storageSession && storageUser) {
    // * [2024.12.30] useAuthStore().actions.setSessions 같은 접근은 react hooks 사용으로 취급되어 수정
    const { actions } = useAuthStoreBase.getState()

    actions.setSessions(JSON.parse(storageSession))
    actions.setUser(JSON.parse(storageUser))

    return true
  }

  return false
}
