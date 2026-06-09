// 세션 레코드를 safeStorage로 암호화해 userData/session.json 에 영속화 (WorkspaceManager 패턴).

import { existsSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { app, safeStorage } from 'electron'
import type { SessionRecord } from './session'

export class SessionManager {
  private static instance: SessionManager | null = null
  private storePath: string

  private constructor() {
    this.storePath = join(app.getPath('userData'), 'session.json')
  }

  static getInstance(): SessionManager {
    if (!SessionManager.instance) {
      SessionManager.instance = new SessionManager()
    }
    return SessionManager.instance
  }

  load(): SessionRecord | null {
    if (!existsSync(this.storePath)) return null
    try {
      const raw = readFileSync(this.storePath)
      const json = safeStorage.isEncryptionAvailable() ? safeStorage.decryptString(raw) : raw.toString('utf-8')
      return JSON.parse(json) as SessionRecord
    } catch {
      return null
    }
  }

  save(session: SessionRecord): void {
    try {
      const json = JSON.stringify(session)
      if (safeStorage.isEncryptionAvailable()) {
        writeFileSync(this.storePath, safeStorage.encryptString(json))
      } else {
        writeFileSync(this.storePath, json, 'utf-8')
      }
    } catch (error) {
      console.warn('[SessionManager] failed to persist session:', error)
    }
  }

  clear(): void {
    if (existsSync(this.storePath)) rmSync(this.storePath)
  }
}
