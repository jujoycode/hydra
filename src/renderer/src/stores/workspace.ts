import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import type { WorkspaceConfig } from '@/types/auth'

interface WorkspaceState {
  workspaces: WorkspaceConfig[]
  setWorkspaces: (ws: WorkspaceConfig[]) => void
  addWorkspace: (ws: WorkspaceConfig) => void
  removeWorkspace: (id: string) => void
  reset: () => void
}

export const useWorkspaceStore = create<WorkspaceState>()(
  persist(
    (set) => ({
      workspaces: [],
      setWorkspaces: (workspaces) => set({ workspaces }),
      addWorkspace: (ws) => set((state) => ({ workspaces: [...state.workspaces, ws] })),
      removeWorkspace: (id) => set((state) => ({ workspaces: state.workspaces.filter((w) => w.id !== id) })),
      reset: () => set({ workspaces: [] })
    }),
    {
      name: 'hydra-workspace-storage',
      storage: createJSONStorage(() => localStorage)
    }
  )
)
