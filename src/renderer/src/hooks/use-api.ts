import {
  type UseMutationOptions,
  type UseQueryOptions,
  type UseQueryResult,
  useMutation,
  useQuery
} from '@tanstack/react-query'
import { toast } from 'sonner'
import type { BaseIpcResponse, IpcChannel, IpcRequest, IpcResponse } from '@/interface/CoreInterface'

/** IpcResponse<T>(= BaseIpcResponse<D>)에서 data 타입 D를 추출한다. */
export type IpcData<T extends IpcChannel> = IpcResponse<T> extends BaseIpcResponse<infer D> ? D : never

/**
 * 타입 안전한 IPC 호출. 핸들러 에러/통신 에러를 토스트로 알리고 throw하여
 * React Query(또는 호출부)가 일관되게 처리하도록 한다. 성공 시 data를 언랩해 반환한다.
 */
export async function invokeApi<T extends IpcChannel>(channel: T, request?: IpcRequest<T>): Promise<IpcData<T>> {
  let result: IpcResponse<T>
  try {
    result = await window.callApi(channel, request)
  } catch (error) {
    toast.error('[IPC_ERROR] Failed to communicate with the application')
    throw error instanceof Error ? error : new Error('IPC communication error')
  }

  if (result?.error) {
    toast.error(`[${result.error.code}] ${result.error.message}`)
    throw new Error(result.error.message)
  }

  return result.data as IpcData<T>
}

/**
 * 단일 IPC 채널 조회를 useQuery로 래핑한다. queryFn/에러처리/언랩을 표준화한다.
 * 응답 매핑이 필요하면 `select`를 사용한다.
 */
export function useApiQuery<T extends IpcChannel, TData = IpcData<T>>(
  queryKey: readonly unknown[],
  channel: T,
  request: IpcRequest<T>,
  options?: Omit<UseQueryOptions<IpcData<T>, Error, TData>, 'queryKey' | 'queryFn'>
): UseQueryResult<TData, Error> {
  return useQuery<IpcData<T>, Error, TData>({
    queryKey,
    queryFn: () => invokeApi(channel, request),
    ...options
  })
}

/** IPC 채널 변경(생성/수정/삭제)을 useMutation으로 래핑한다. */
export function useApiMutation<T extends IpcChannel>(
  channel: T,
  options?: Omit<UseMutationOptions<IpcData<T>, Error, IpcRequest<T>>, 'mutationFn'>
) {
  return useMutation<IpcData<T>, Error, IpcRequest<T>>({
    mutationFn: (request: IpcRequest<T>) => invokeApi(channel, request),
    ...options
  })
}
