import { useQueryClient } from '@tanstack/react-query'
import { IpcChannel } from '@/interface/CoreInterface'
import { queryKeys } from '@/lib/queryKeys'
import { useApiMutation, useApiQuery } from './use-api'

/** 단일 이슈 상세 조회. */
export function useIssue(issueId: string | undefined) {
  return useApiQuery(
    queryKeys.issues.detail(issueId ?? ''),
    IpcChannel.ISSUE_GET,
    { issueId: issueId ?? '' },
    { enabled: !!issueId }
  )
}

/** 이슈의 댓글 목록. */
export function useComments(issueId: string | undefined) {
  return useApiQuery(
    queryKeys.comments.byIssue(issueId ?? ''),
    IpcChannel.COMMENT_LIST,
    { issueId: issueId ?? '' },
    { enabled: !!issueId }
  )
}

/** 이슈에 연결된 라벨 목록. */
export function useIssueLabels(issueId: string | undefined) {
  return useApiQuery(
    queryKeys.labels.byIssue(issueId ?? ''),
    IpcChannel.LABEL_LIST_BY_ISSUE,
    { issueId: issueId ?? '' },
    { enabled: !!issueId }
  )
}

/** 워크스페이스 전체 라벨 목록. */
export function useAllLabels() {
  return useApiQuery(queryKeys.labels.all, IpcChannel.LABEL_LIST, undefined)
}

/** 이슈의 관계(blocks/is_blocked_by/relates_to) 목록. */
export function useIssueRelations(issueId: string | undefined) {
  return useApiQuery(
    queryKeys.relations.byIssue(issueId ?? ''),
    IpcChannel.ISSUE_RELATION_LIST,
    { issueId: issueId ?? '' },
    { enabled: !!issueId }
  )
}

/** 이슈에 첨부된 파일 목록. */
export function useIssueFiles(issueId: string | undefined) {
  return useApiQuery(
    queryKeys.files.byIssue(issueId ?? ''),
    IpcChannel.STORAGE_LIST_ISSUE_FILES,
    { issueId: issueId ?? '' },
    { enabled: !!issueId }
  )
}

/** 이슈 본문 수정 뮤테이션. 성공 시 상세 캐시를 무효화한다. */
export function useIssueMutations(issueId: string | undefined) {
  const queryClient = useQueryClient()
  const update = useApiMutation(IpcChannel.ISSUE_UPDATE, {
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.issues.detail(issueId ?? '') })
  })
  return { update }
}

/** 댓글 생성/수정/삭제 뮤테이션. 성공 시 댓글 캐시를 무효화한다. */
export function useCommentMutations(issueId: string | undefined) {
  const queryClient = useQueryClient()
  const invalidate = () => queryClient.invalidateQueries({ queryKey: queryKeys.comments.byIssue(issueId ?? '') })

  const create = useApiMutation(IpcChannel.COMMENT_CREATE, { onSuccess: invalidate })
  const update = useApiMutation(IpcChannel.COMMENT_UPDATE, { onSuccess: invalidate })
  const remove = useApiMutation(IpcChannel.COMMENT_DELETE, { onSuccess: invalidate })

  return { create, update, remove }
}

/** 라벨 연결/해제 뮤테이션. 성공 시 이슈 라벨 캐시를 무효화한다. */
export function useLabelMutations(issueId: string | undefined) {
  const queryClient = useQueryClient()
  const invalidate = () => queryClient.invalidateQueries({ queryKey: queryKeys.labels.byIssue(issueId ?? '') })

  const link = useApiMutation(IpcChannel.LABEL_LINK, { onSuccess: invalidate })
  const unlink = useApiMutation(IpcChannel.LABEL_UNLINK, { onSuccess: invalidate })

  return { link, unlink }
}

/** 이슈 관계 생성/삭제 뮤테이션. 성공 시 관계 캐시를 무효화한다. */
export function useRelationMutations(issueId: string | undefined) {
  const queryClient = useQueryClient()
  const invalidate = () => queryClient.invalidateQueries({ queryKey: queryKeys.relations.byIssue(issueId ?? '') })

  const create = useApiMutation(IpcChannel.ISSUE_RELATION_CREATE, { onSuccess: invalidate })
  const remove = useApiMutation(IpcChannel.ISSUE_RELATION_DELETE, { onSuccess: invalidate })

  return { create, remove }
}

/** 파일 연결/해제 뮤테이션. 성공 시 첨부 파일 캐시를 무효화한다. (업로드 자체는 페이지에서 직접 호출) */
export function useFileMutations(issueId: string | undefined) {
  const queryClient = useQueryClient()
  const invalidate = () => queryClient.invalidateQueries({ queryKey: queryKeys.files.byIssue(issueId ?? '') })

  const link = useApiMutation(IpcChannel.STORAGE_LINK_FILE, { onSuccess: invalidate })
  const unlink = useApiMutation(IpcChannel.STORAGE_UNLINK_FILE, { onSuccess: invalidate })

  return { link, unlink, invalidate }
}
