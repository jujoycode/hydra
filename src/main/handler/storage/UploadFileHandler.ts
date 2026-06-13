import fs from 'node:fs'
import path from 'node:path'
import { app } from 'electron'
import { CoreBaseHandler } from '@/base/CoreBaseHandler'
import { StorageError } from '@/error/StorageError'
import { IpcChannel, type UploadFileParams } from '@/interface/CoreInterface'
import { CoreUtil } from '@/util/CoreUtil'

export class UploadFileHandler extends CoreBaseHandler<IpcChannel.STORAGE_UPLOAD_FILE> {
  constructor() {
    super(IpcChannel.STORAGE_UPLOAD_FILE)
  }

  public async handler(params: UploadFileParams) {
    try {
      // 1. 로컬 파일 저장 디렉토리 생성
      const storageDir = path.join(app.getPath('userData'), 'hydra-files')
      if (!fs.existsSync(storageDir)) {
        fs.mkdirSync(storageDir, { recursive: true })
      }

      // 2. 파일 저장
      const fileId = CoreUtil.getUuid()
      const ext = path.extname(params.fileName)
      const savedFileName = `${fileId}${ext}`
      const savedPath = path.join(storageDir, savedFileName)

      const buffer = Buffer.from(params.fileData)
      fs.writeFileSync(savedPath, buffer)

      // 3. DB에 파일 레코드 생성
      const fileRecord = await this.repos.files.create({
        fileId,
        fileName: params.fileName,
        filePath: savedPath,
        fileType: ext.replace('.', '') || 'unknown',
        fileSize: buffer.byteLength
      })

      return { data: fileRecord, error: null }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error)
      this.logError(`UploadFileHandler Error: ${message}`)
      throw new StorageError(message)
    }
  }
}
