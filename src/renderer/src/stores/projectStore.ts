import { create } from 'zustand'
import { createSelectors } from '@utils/zustand'
import type { Project } from '@interface/CoreInterface'

interface ProjectStore {
  projects: Record<string, Project>
  actions: ProjectAction
}

interface ProjectAction {
  addProject: (project: Project | Project[]) => void
  updateProject: (project: Project) => void
  removeProject: (projectId: string) => void
  clearProject: () => void
}

// 스토리지 유틸리티
const saveProjects = (projects: Record<string, Project>) => {
  localStorage.setItem('projects', JSON.stringify(projects))
}

export const useProjectStoreBase = create<ProjectStore>((set) => ({
  projects: {},

  actions: {
    addProject: (project) =>
      set((state) => {
        // 새 객체 생성 (불변성 유지)
        const newProjects = { ...state.projects }

        // 단일 프로젝트 또는 프로젝트 배열 처리
        const projectsToAdd = Array.isArray(project) ? project : [project]

        // 각 프로젝트 추가 - 중복 체크 포함
        let hasChanges = false

        projectsToAdd.forEach((project) => {
          // 유효성 검사
          if (!project || !project.project_id) return

          // 이미 존재하는 프로젝트인지 확인
          if (state.projects[project.project_id]) {
            const existingProject = state.projects[project.project_id]
            if (JSON.stringify(existingProject) === JSON.stringify(project)) {
              return // 변경사항 없음, 스킵
            }
          }

          // 프로젝트 추가
          newProjects[project.project_id] = project
          hasChanges = true
        })

        // 변경사항이 있을 때만 저장
        if (hasChanges) {
          saveProjects(newProjects)
          return { projects: newProjects }
        }

        return state
      }),

    updateProject: (project) =>
      set((state) => {
        // 프로젝트가 존재하지 않으면 무시
        if (!state.projects[project.project_id]) {
          return state
        }

        const newProjects = {
          ...state.projects,
          [project.project_id]: project
        }

        saveProjects(newProjects)
        return { projects: newProjects }
      }),

    removeProject: (projectId) =>
      set((state) => {
        // 프로젝트가 존재하지 않으면 무시
        if (!state.projects[projectId]) {
          return state
        }

        // 새 객체 생성하고 해당 프로젝트 제외
        const newProjects = { ...state.projects }
        delete newProjects[projectId]

        saveProjects(newProjects)
        return { projects: newProjects }
      }),

    clearProject: () => {
      localStorage.removeItem('projects')
      set({ projects: {} })
    }
  }
}))

export const useProjectStore = createSelectors(useProjectStoreBase)

/**
 * initializeProject
 * @desc 프로젝트 초기화
 */
export const initializeProject = () => {
  const storageProjects = localStorage.getItem('projects')

  if (storageProjects) {
    try {
      const parsed = JSON.parse(storageProjects)
      const { actions } = useProjectStoreBase.getState()

      // 객체 형태인 경우 처리 (Record<string, Project>)
      if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
        // 객체의 값들을 배열로 변환하고 타입 보장
        const projectsArray = Object.values(parsed).filter(
          (item) => item && typeof item === 'object' && 'project_id' in item
        ) as Project[]

        if (projectsArray.length > 0) {
          actions.addProject(projectsArray)
        }
      }
      // 이미 배열 형태인 경우
      else if (Array.isArray(parsed)) {
        const validProjects = parsed.filter(
          (item) => item && typeof item === 'object' && 'project_id' in item
        ) as Project[]

        if (validProjects.length > 0) {
          actions.addProject(validProjects)
        }
      }
    } catch (error) {
      console.error('프로젝트 초기화 오류:', error)
    }
  }
}
