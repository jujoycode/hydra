import { CoreBaseHandler } from '@/base/CoreBaseHandler'
import { SupabaseLib } from '@/lib/SupabaseLib'
import { CoreConstant } from '@/constant/CoreConstant'
import {
  IpcChannel,
  SUPABASE_CLIENT_TYPE,
  type SupaStorageClient,
  type IpcResponse,
  type UploadFileParams,
} from '@/interface/CoreInterface'

export class UploadFileHandler extends CoreBaseHandler<IpcChannel.STORAGE_UPLOAD_FILE> {
  private supaStorageClient: SupaStorageClient

  constructor() {
    super(IpcChannel.STORAGE_UPLOAD_FILE)
    this.supaStorageClient = SupabaseLib.getClient(SUPABASE_CLIENT_TYPE.STORAGE)
  }

  public async handler(params: UploadFileParams): Promise<IpcResponse<IpcChannel.STORAGE_UPLOAD_FILE>> {
    this.logInfo(`${params.savePath} ${params.file}`)

    const { data, error } = await this.supaStorageClient
      .from(CoreConstant.BUCKET_NAME)
      .upload(params.savePath, params.file, params.fileOptions)

    if (error !== null) {
      this.logError(JSON.stringify(error, null, 2))
    }

    return { data, error }
  }
}
