// Drizzle 기반 파일 리포지토리 구현

import { and, eq } from 'drizzle-orm'
import { CoreUtil } from '../../../util/CoreUtil'
import * as pgSchema from '../../schema/drizzle/schema'
import type { CreateFileData, FileRecord, FileRepository } from '../interfaces/FileRepository'
import type { DrizzleDb, DrizzleSchema } from './executor'
import { selectById } from './readAfterWrite'

export class DrizzleFileRepository implements FileRepository {
  constructor(
    private db: DrizzleDb,
    private schema: DrizzleSchema = pgSchema
  ) {}

  async create(data: CreateFileData): Promise<FileRecord> {
    const { files } = this.schema
    const now = new Date()
    await this.db.insert(files).values({
      file_id: data.fileId,
      file_name: data.fileName,
      file_path: data.filePath,
      file_type: data.fileType,
      file_size: data.fileSize,
      file_created_at: now,
      file_updated_at: now
    })
    return selectById<FileRecord>(this.db, files, files.file_id, data.fileId)
  }

  async findById(fileId: string): Promise<FileRecord | null> {
    const { files } = this.schema
    const rows = await this.db.select().from(files).where(eq(files.file_id, fileId)).limit(1)
    return (rows[0] as FileRecord) ?? null
  }

  async delete(fileId: string): Promise<boolean> {
    const { files } = this.schema
    await this.db.delete(files).where(eq(files.file_id, fileId))
    return true
  }

  async linkToIssue(issueId: string, fileId: string): Promise<void> {
    const { issuesFilesLink } = this.schema
    await this.db.insert(issuesFilesLink).values({
      issue_file_link_id: CoreUtil.getUuid(),
      issue_id: issueId,
      file_id: fileId
    })
  }

  async unlinkFromIssue(issueId: string, fileId: string): Promise<void> {
    const { issuesFilesLink } = this.schema
    await this.db
      .delete(issuesFilesLink)
      .where(and(eq(issuesFilesLink.issue_id, issueId), eq(issuesFilesLink.file_id, fileId)))
  }

  async findByIssue(issueId: string): Promise<FileRecord[]> {
    const { files, issuesFilesLink } = this.schema
    const rows = await this.db
      .select({
        file_id: files.file_id,
        file_name: files.file_name,
        file_path: files.file_path,
        file_type: files.file_type,
        file_size: files.file_size,
        file_created_at: files.file_created_at,
        file_updated_at: files.file_updated_at
      })
      .from(issuesFilesLink)
      .innerJoin(files, eq(issuesFilesLink.file_id, files.file_id))
      .where(eq(issuesFilesLink.issue_id, issueId))
    return rows as FileRecord[]
  }
}
