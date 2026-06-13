import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import type { DbmsType } from '@/interface/CoreInterface'
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
      storage: createJSONStorage(() => localStorage),
      version: 1,
      // Phase 4 이전 persist에는 dbms 필드가 없다 → postgresql로 백필
      migrate: (persisted: unknown, _version: number): WorkspaceState => {
        const state = persisted as WorkspaceState
        if (state?.workspaces) {
          state.workspaces = state.workspaces.map((ws) => ({
            ...ws,
            dbms: (ws as { dbms?: DbmsType }).dbms ?? 'postgresql'
          }))
        }
        return state
      }
    }
  )
)
