import { CoreBaseHandler } from '@base/CoreBaseHandler'
import { SupabaseLib } from '@lib/SupabaseLib'
import { CoreConstant } from '@constant/CoreConstant'
import {
  IpcChannel,
  SUPABASE_CLIENT_TYPE,
  type SupaStorageClient,
  type UploadFileParams
} from '@interface/CoreInterface'

export class UploadFileHandler extends CoreBaseHandler<IpcChannel.STORAGE_UPLOAD_FILE> {
  private supaStorageClient: SupaStorageClient

  constructor() {
    super(IpcChannel.STORAGE_UPLOAD_FILE)
    this.supaStorageClient = SupabaseLib.getClient(SUPABASE_CLIENT_TYPE.STORAGE)
  }

  public async handler(params: UploadFileParams) {
    this.logInfo(`${params.savePath} ${params.file}`)

    const { data, error } = await this.supaStorageClient
      .from(CoreConstant.BUCKET_NAME)
      .upload(params.savePath, params.file, params.fileOptions)

    if (error !== null) {
      this.logError(`${JSON.stringify(error)}`)
    }

    this.logSuccess(`upload file success (${data?.id})`)

    return { data, error }
  }
}
