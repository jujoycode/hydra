import { CoreBaseHandler } from '@/base/CoreBaseHandler'
import { type InviteGenerateParams, IpcChannel } from '@/interface/CoreInterface'

export class GenerateInviteHandler extends CoreBaseHandler<IpcChannel.INVITE_GENERATE> {
  constructor() {
    super(IpcChannel.INVITE_GENERATE)
  }

  async handler(params: InviteGenerateParams) {
    const expiresAt = params.expiresInHours
      ? new Date(Date.now() + params.expiresInHours * 60 * 60 * 1000).toISOString()
      : null

    const payload = {
      workspaceName: params.workspaceName,
      host: params.host,
      port: params.port,
      dbName: params.dbName,
      expiresAt
    }

    const code = Buffer.from(JSON.stringify(payload)).toString('base64')

    return { data: { code }, error: null }
  }
}
