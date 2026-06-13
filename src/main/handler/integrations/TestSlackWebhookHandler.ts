import { CoreBaseHandler } from '@/base/CoreBaseHandler'
import { ErrorCode, IpcChannel, type TestSlackWebhookParams } from '@/interface/CoreInterface'

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
        return {
          data: false,
          error: {
            code: ErrorCode.NETWORK_ERROR,
            message: `Slack responded with ${response.status}`,
            data: null
          }
        }
      }
      return { data: true, error: null }
    } catch (error: unknown) {
      return {
        data: false,
        error: {
          code: ErrorCode.NETWORK_ERROR,
          message: error instanceof Error ? error.message : 'Failed to send test message',
          data: null
        }
      }
    }
  }
}
