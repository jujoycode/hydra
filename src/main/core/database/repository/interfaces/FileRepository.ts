// 파일 리포지토리 인터페이스

export interface CreateFileData {
  fileId: string
  fileName: string
  filePath: string
  fileType: string
  fileSize: number
}

export interface FileRecord {
  file_id: string
  file_name: string
  file_path: string
  file_type: string
  file_size: number
  file_created_at: Date | null
  file_updated_at: Date | null
}

export interface FileRepository {
  create(data: CreateFileData): Promise<FileRecord>
  findById(fileId: string): Promise<FileRecord | null>
  delete(fileId: string): Promise<boolean>
  linkToIssue(issueId: string, fileId: string): Promise<void>
  unlinkFromIssue(issueId: string, fileId: string): Promise<void>
  findByIssue(issueId: string): Promise<FileRecord[]>
}
