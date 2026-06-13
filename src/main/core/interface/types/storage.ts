import type { FileRecord } from '../../database/repository/interfaces/FileRepository'

export type File = FileRecord

export interface UploadFileParams {
  fileName: string
  filePath: string
  fileData: ArrayBuffer
}

export interface LinkFileParams {
  issueId: string
  fileId: string
}

export interface ListIssueFilesParams {
  issueId: string
}
