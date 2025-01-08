import { CoreBaseHandler } from '@base/CoreBaseHandler'
import { SupabaseLib } from '@lib/SupabaseLib'
import { CoreConstant } from '@constant/CoreConstant'
import {
  IpcChannel,
  SUPABASE_CLIENT_TYPE,
  type SupaStorageClient,
  type UploadFileParams
} from '@interface/CoreInterface'

export class UploadFileHandler extends CoreBaseHandler {
  private supaStorageClient: SupaStorageClient

  constructor() {
    super(IpcChannel.STORAGE_UPLOAD_FILE)
    this.supaStorageClient = SupabaseLib.getClient(SUPABASE_CLIENT_TYPE.STORAGE)
  }

  public async handler({ savePath, file, fileOptions }: UploadFileParams) {
    this.logInfo(`${savePath} ${file}`)

    const { data, error } = await this.supaStorageClient
      .from(CoreConstant.BUCKET_NAME)
      .upload(savePath, file, fileOptions)

    if (error !== null) {
      this.logError(`${JSON.stringify(error)}`)
      throw new Error('Failed to upload file')
    }

    this.logInfo(`${JSON.stringify(data)}`)

    return data
  }
}
