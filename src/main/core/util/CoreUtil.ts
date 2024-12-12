import { CoreBase } from '@base/CoreBase'
import { join, resolve } from 'path'
import { readFile, writeFile } from 'fs/promises'

export class CoreUtil extends CoreBase {
  // path
  static pathJoin = (...paths: string[]) => join(...paths)
  static pathResolve = (...paths: string[]) => resolve(...paths)

  // fs
  static async readFile(path: string): Promise<string> {
    return await readFile(path, 'utf-8')
  }

  static async writeFile(path: string, data: string): Promise<boolean> {
    try {
      await writeFile(path, data)
      return true
    } catch (error) {
      return false
    }
  }
}
