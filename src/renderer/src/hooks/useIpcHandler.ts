import { toaster } from '@components/ui/toaster'
import { IpcChannel, type IpcRequest, type IpcResponse } from '@interface/CoreInterface'
import { useCallback } from 'react'

export function useIpcHandler<T extends IpcChannel>(channel: T) {
  return useCallback(
    async (request?: IpcRequest<T>): Promise<IpcResponse<T>> => {
      const result = await window.callApi(channel, request)

      if (result.error) {
        toaster.error({
          title: result.error.name ?? 'Error',
          description: result.error instanceof Error ? result.error.message : 'An unexpected error occurred'
        })
      }

      return result
    },
    [channel]
  )
}
