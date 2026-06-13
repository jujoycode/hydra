/**
 * React Query queryKey 팩토리.
 * 문자열 드리프트를 막고 무효화(invalidate) 시 키를 한 곳에서 관리한다.
 */
export const queryKeys = {
  issues: {
    all: ['issues'] as const,
    byProject: (projectId: string) => ['issues', 'project', projectId] as const,
    mine: (userId: string) => ['issues', 'mine', userId] as const
  },
  projects: {
    all: ['projects'] as const,
    members: (projectId: string) => ['projects', projectId, 'members'] as const
  }
} as const
