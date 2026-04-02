import { useMemo } from 'react'
import { useProjectStore } from '@/stores/project'

/**
 * 프로젝트 상태를 관리하는 커스텀 훅
 * @returns 프로젝트 상태 및 기능
 */
export const useProject = () => {
  const { projects, selectedProjectId, isLoading, error, setProjects, setSelectedProjectId, setError, reset } =
    useProjectStore()

  // 현재 선택된 프로젝트
  const selectedProject = useMemo(() => {
    if (!projects || !selectedProjectId) return null
    return projects.find((project) => project.project_id === selectedProjectId) || null
  }, [projects, selectedProjectId])

  return {
    projects,
    selectedProjectId,
    selectedProject,
    isLoading,
    error,
    setProjects,
    setSelectedProjectId,
    setError,
    reset
  }
}
