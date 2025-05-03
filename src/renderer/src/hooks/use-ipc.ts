import { useCallback } from 'react'
import { toast } from 'sonner'
import { IpcChannel, type BaseErrorType, type IpcRequest, type IpcResponse } from '@/interface/CoreInterface'

export function useIpcHandler<T extends IpcChannel>(channel: T) {
  return useCallback(
    async (request?: IpcRequest<T>): Promise<IpcResponse<T>> => {
      try {
        const result = await window.callApi(channel, request)

        // 에러 처리
        if (result && result.error) {
          // 일단 에러인 경우 전부 BaseErrorType 인걸로 간주
          toast.error(`[${result.error.code}] ${result.error.message}`)
        }

        return result
      } catch (error) {
        // IPC 통신 자체의 오류 처리
        console.error(`IPC communication error for channel ${channel}:`, error)
        toast.error('[IPC_ERROR] Failed to communicate with the application')

        // 기본 에러 응답 반환
        return {
          data: null,
          error: {
            code: 'UNKNOWN_ERROR',
            message: error instanceof Error ? error.message : 'Communication error',
            data: null
          } as BaseErrorType
        } as IpcResponse<T>
      }
    },
    [channel]
  )
}
