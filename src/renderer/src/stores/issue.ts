import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import type { Issue as IssueRecord } from '@/interface/CoreInterface'
import type { IssueStoreState } from '@/types/issue'

export const useIssueStore = create<IssueStoreState>()(
  persist(
    (set) => ({
      issues: null,
      selectedIssueId: null,
      isLoading: false,
      error: null,

      setIssues: (issues: IssueRecord[] | null) => set({ issues }),
      setSelectedIssueId: (issueId: string | null) => set({ selectedIssueId: issueId }),
      setLoading: (loading: boolean) => set({ isLoading: loading }),
      setError: (error: Error | null) => set({ error }),
      reset: () =>
        set({
          issues: null,
          selectedIssueId: null,
          isLoading: false,
          error: null
        })
    }),
    {
      name: 'hydra-issue-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ issues: state.issues, selectedIssueId: state.selectedIssueId }),
      skipHydration: false
    }
  )
)
