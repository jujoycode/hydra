import type { Project } from '@/interface/CoreInterface'

export interface ProjectState {
  projects: Project[] | null
  selectedProjectId: string | null
  isLoading: boolean
  error: Error | null
  setProjects: (projects: Project[] | null) => void
  setSelectedProjectId: (projectId: string | null) => void
  setError: (error: Error | null) => void
  reset: () => void
}
