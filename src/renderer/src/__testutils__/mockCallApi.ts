import { vi } from 'vitest'
import type { IpcChannel, IpcRequest, IpcResponse } from '@/interface/CoreInterface'

type Handlers = {
  [C in IpcChannel]?: (request: IpcRequest<C>) => IpcResponse<C> | Promise<IpcResponse<C>>
}

/**
 * 렌더러 테스트에서 window.callApi를 모킹한다.
 * 채널별 응답 핸들러를 주입하고, 미지정 채널은 { data: null, error: null }을 돌려준다.
 *
 *   installMockCallApi({
 *     [IpcChannel.ISSUE_LIST]: () => ({ data: [], error: null })
 *   })
 */
export function installMockCallApi(handlers: Handlers = {}) {
  const callApi = vi.fn(async (channel: IpcChannel, request?: unknown) => {
    const handler = handlers[channel] as ((req: unknown) => unknown) | undefined
    if (handler) return handler(request)
    return { data: null, error: null }
  })
  ;(window as unknown as { callApi: typeof callApi }).callApi = callApi
  return callApi
}
