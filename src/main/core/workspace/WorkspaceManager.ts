import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { app, safeStorage } from 'electron'
import type { WorkspaceConfig } from '@/interface/CoreInterface'
import { CoreUtil } from '@/util/CoreUtil'

export type { WorkspaceConfig }

interface WorkspaceStore {
  workspaces: WorkspaceConfig[]
  lastUsedId?: string
}

export class WorkspaceManager {
  private static instance: WorkspaceManager | null = null
  private storePath: string
  private store: WorkspaceStore

  private constructor() {
    this.storePath = join(app.getPath('userData'), 'workspaces.json')
    this.store = this.load()
  }

  static getInstance(): WorkspaceManager {
    if (!WorkspaceManager.instance) {
      WorkspaceManager.instance = new WorkspaceManager()
    }
    return WorkspaceManager.instance
  }

  private load(): WorkspaceStore {
    if (!existsSync(this.storePath)) {
      return { workspaces: [] }
    }

    try {
      const raw = readFileSync(this.storePath)

      if (safeStorage.isEncryptionAvailable()) {
        const decrypted = safeStorage.decryptString(raw)
        return JSON.parse(decrypted) as WorkspaceStore
      }

      return JSON.parse(raw.toString('utf-8')) as WorkspaceStore
    } catch {
      return { workspaces: [] }
    }
  }

  private save(): void {
    const json = JSON.stringify(this.store, null, 2)

    if (safeStorage.isEncryptionAvailable()) {
      const encrypted = safeStorage.encryptString(json)
      writeFileSync(this.storePath, encrypted)
    } else {
      writeFileSync(this.storePath, json, 'utf-8')
    }
  }

  getAll(): WorkspaceConfig[] {
    return this.store.workspaces
  }

  getById(id: string): WorkspaceConfig | undefined {
    return this.store.workspaces.find((w) => w.id === id)
  }

  getLastUsed(): WorkspaceConfig | undefined {
    if (!this.store.lastUsedId) return undefined
    return this.getById(this.store.lastUsedId)
  }

  add(config: Omit<WorkspaceConfig, 'id'>): WorkspaceConfig {
    const workspace: WorkspaceConfig = {
      id: CoreUtil.getUuid(),
      ...config
    }
    this.store.workspaces.push(workspace)
    this.save()
    return workspace
  }

  update(id: string, data: Partial<Omit<WorkspaceConfig, 'id'>>): WorkspaceConfig {
    const index = this.store.workspaces.findIndex((w) => w.id === id)
    if (index === -1) {
      throw new Error(`Workspace not found: ${id}`)
    }
    this.store.workspaces[index] = { ...this.store.workspaces[index], ...data }
    this.save()
    return this.store.workspaces[index]
  }

  remove(id: string): boolean {
    const before = this.store.workspaces.length
    this.store.workspaces = this.store.workspaces.filter((w) => w.id !== id)
    if (this.store.lastUsedId === id) {
      this.store.lastUsedId = undefined
    }
    this.save()
    return this.store.workspaces.length < before
  }

  setLastUsed(id: string): void {
    this.store.lastUsedId = id
    this.save()
  }
}
