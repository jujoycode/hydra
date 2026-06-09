import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { basename, dirname, extname, join, resolve } from 'node:path'
import { v7 as uuidv7 } from 'uuid'
import { CoreBase } from '@/base/CoreBase'

export class CoreUtil extends CoreBase {
  /**
   * getUuid
   * @returns UUID v7 문자열 (시간 정렬 가능 — InnoDB/PG 인덱스 지역성 향상)
   */
  static getUuid(): string {
    return uuidv7()
  }

  /**
   * getEnv
   * @param key 조회할 환경변수 Key
   */
  static getEnv(key: string): string {
    if (!key) {
      throw new Error('Environment variable key is required')
    }

    const value = process.env[key]
    if (!value) {
      throw new Error(`Environment variable ${key} is not set`)
    }

    return value
  }

  private parseError(error: unknown): string {
    if (error instanceof Error) return error.message
    else return `Unknown error: ${error}`
  }

  // Path operations
  public pathJoin(...paths: string[]): string {
    return join(...paths)
  }

  public pathResolve(...paths: string[]): string {
    return resolve(...paths)
  }

  public getDirname(path: string): string {
    return dirname(path)
  }

  public getBasename(path: string, ext?: string): string {
    return basename(path, ext)
  }

  public getExtname(path: string): string {
    return extname(path)
  }

  // File operations
  public async readFile(path: string, encoding: BufferEncoding = 'utf-8'): Promise<string> {
    try {
      return await readFile(path, { encoding })
    } catch (error) {
      throw new Error(`Failed to read file at ${this.parseError(error)}`)
    }
  }

  public async writeFile(path: string, data: string | Buffer, options?: { deep?: boolean }): Promise<void> {
    try {
      if (options?.deep) await mkdir(dirname(path), { recursive: true })

      await writeFile(path, data)
    } catch (error) {
      throw new Error(`Failed to write file at ${this.parseError(error)}`)
    }
  }
}
