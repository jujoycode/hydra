import { create } from 'zustand'

interface PanelState {
  isDetailOpen: boolean
  selectedIssueId: string | null
  openDetail: (issueId: string) => void
  closeDetail: () => void
}

export const usePanelStore = create<PanelState>()((set) => ({
  isDetailOpen: false,
  selectedIssueId: null,
  openDetail: (issueId) => set({ isDetailOpen: true, selectedIssueId: issueId }),
  closeDetail: () => set({ isDetailOpen: false, selectedIssueId: null })
}))
