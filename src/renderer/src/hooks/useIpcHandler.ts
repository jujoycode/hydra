import { toaster } from '@components/ui/toaster'
import { IpcChannel, type IpcRequest, type IpcResponse } from '@interface/CoreInterface'

export async function useIpcHandler(
  channel: IpcChannel,
  request?: IpcRequest<IpcChannel>
): Promise<IpcResponse<IpcChannel>> {
  const result = await window.callApi(channel, request)

  if (result.error) {
    toaster.error({
      title: result.error?.code ?? 'Error',
      description: result.error instanceof Error ? result.error.message : 'An unexpected error occurred'
    })
  }

  return result
}
