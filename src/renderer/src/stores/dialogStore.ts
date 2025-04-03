import { create } from 'zustand'
import { createSelectors } from '@utils/zustand'

type DialogType = 'createProject' | 'createIssue'

interface DialogStore {
  openDialog: (type: DialogType) => void
  closeDialog: (type: DialogType) => void

  createProjectModal: boolean
  createIssueModal: boolean
}

export const useDialogStoreBase = create<DialogStore>((set) => ({
  openDialog: (type) => set({ [`${type}Modal`]: true }),
  closeDialog: (type) => set({ [`${type}Modal`]: false }),

  createProjectModal: false,
  createIssueModal: false
}))

export const useDialogStore = createSelectors(useDialogStoreBase)
