import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { Project } from '@/interface/CoreInterface'
import type { ProjectState } from '@/types/project'

/**
 * 프로젝트 상태를 관리하는 Zustand 스토어
 *
 * - projects: 프로젝트 목록
 * - selectedProjectId: 선택된 프로젝트 ID
 * - isLoading: 로딩 상태
 * - error: 에러 정보
 */

// 스토어 생성 함수
export const useProjectStore = create<ProjectState>()(
  persist(
    (set) => ({
      projects: null,
      selectedProjectId: null,
      isLoading: false,
      error: null,

      setProjects: (projects: Project[] | null) => set({ projects }),

      setSelectedProjectId: (projectId: string | null) => set({ selectedProjectId: projectId }),

      setError: (error: Error | null) => set({ error }),

      reset: () =>
        set({
          projects: null,
          selectedProjectId: null,
          isLoading: false,
          error: null
        })
    }),
    {
      name: 'hydra-project-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ projects: state.projects, selectedProjectId: state.selectedProjectId }),
      skipHydration: false
    }
  )
)
