import { create } from 'zustand'
import { createSelectors } from '@utils/zustand'
import type { Project } from '@interface/CoreInterface'

interface ProjectStore {
  projectsMap: Map<string, Project>
  actions: ProjectAction
}

interface ProjectAction {
  addProject: (project: Project) => void
  updateProject: (project: Project) => void
  removeProject: (projectId: string) => void
}

export const useProjectStoreBase = create<ProjectStore>((set) => ({
  projectsMap: new Map(),

  actions: {
    addProject: (project) =>
      set((state) => {
        const newMap = new Map(state.projectsMap)
        newMap.set(project.project_id, project)

        return { projectsMap: newMap }
      }),

    updateProject: (project) =>
      set((state) => {
        const newMap = new Map(state.projectsMap)
        if (newMap.has(project.project_id)) {
          newMap.set(project.project_id, project)
        }

        return { projectsMap: newMap }
      }),

    removeProject: (projectId) =>
      set((state) => {
        const newMap = new Map(state.projectsMap)
        newMap.delete(projectId)

        return { projectsMap: newMap }
      })
  }
}))

export const useProjectStore = createSelectors(useProjectStoreBase)
