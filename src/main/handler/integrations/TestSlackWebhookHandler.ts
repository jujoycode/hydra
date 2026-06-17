import { CoreBaseHandler } from '@/base/CoreBaseHandler'
import { NetworkError } from '@/error/NetworkError'
import { IpcChannel, type TestSlackWebhookParams } from '@/interface/CoreInterface'

export class TestSlackWebhookHandler extends CoreBaseHandler<IpcChannel.INTEGRATION_TEST_SLACK> {
  constructor() {
    super(IpcChannel.INTEGRATION_TEST_SLACK)
  }

  async handler(params: TestSlackWebhookParams) {
    try {
      const response = await fetch(params.webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: 'Hydra test notification - connection successful!' })
      })
      if (!response.ok) {
        throw new NetworkError(`Slack responded with ${response.status}`)
      }
      return { data: true, error: null }
    } catch (error: unknown) {
      if (error instanceof NetworkError) throw error
      throw new NetworkError(error instanceof Error ? error.message : 'Failed to send test message')
    }
  }
}
