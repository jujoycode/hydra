import { useCallback } from 'react'
import { toast } from 'sonner'
import { IpcChannel, type IpcRequest, type IpcResponse } from '@/interface/CoreInterface'

export function useIpcHandler<T extends IpcChannel>(channel: T) {
  return useCallback(
    async (request?: IpcRequest<T>): Promise<IpcResponse<T>> => {
      const result = await window.callApi(channel, request)

      if (result.error) {
        toast.error(result.error instanceof Error ? result.error.message : 'An unexpected error occurred')
      }

      return result
    },
    [channel]
  )
}
