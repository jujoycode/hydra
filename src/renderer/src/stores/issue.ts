import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import type { IssueStoreState } from '@/types/issue'

export const useIssueStore = create<IssueStoreState>()(
  persist(
    (set) => ({
      selectedIssueId: null,
      isLoading: false,
      error: null,

      setSelectedIssueId: (issueId: string | null) => set({ selectedIssueId: issueId }),
      setLoading: (loading: boolean) => set({ isLoading: loading }),
      setError: (error: Error | null) => set({ error }),
      reset: () =>
        set({
          selectedIssueId: null,
          isLoading: false,
          error: null
        })
    }),
    {
      name: 'hydra-issue-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ selectedIssueId: state.selectedIssueId }),
      skipHydration: false
    }
  )
)
