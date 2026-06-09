import { eq } from 'drizzle-orm'
import * as schema from '../../schema/drizzle/schema'
import type { DrizzleDb } from './executor'
import type {
  CreateIntegrationData,
  IntegrationRecord,
  IntegrationRepository
} from '../interfaces/IntegrationRepository'

const { integrations } = schema

export class DrizzleIntegrationRepository implements IntegrationRepository {
  constructor(private db: DrizzleDb) {}

  async create(data: CreateIntegrationData): Promise<IntegrationRecord> {
    const rows = await this.db
      .insert(integrations)
      .values({
        integration_id: data.integrationId,
        integration_type: data.integrationType,
        integration_config: data.integrationConfig,
        integration_enabled: data.integrationEnabled ?? false
      })
      .returning()
    return rows[0] as IntegrationRecord
  }

  async findAll(): Promise<IntegrationRecord[]> {
    const rows = await this.db.select().from(integrations)
    return rows as IntegrationRecord[]
  }

  async findByType(type: string): Promise<IntegrationRecord | null> {
    const rows = await this.db.select().from(integrations).where(eq(integrations.integration_type, type)).limit(1)
    return (rows[0] as IntegrationRecord) ?? null
  }

  async update(
    integrationId: string,
    data: { integrationConfig?: string; integrationEnabled?: boolean }
  ): Promise<IntegrationRecord> {
    const updateData: Record<string, unknown> = {
      integration_updated_at: new Date()
    }
    if (data.integrationConfig !== undefined) {
      updateData.integration_config = data.integrationConfig
    }
    if (data.integrationEnabled !== undefined) {
      updateData.integration_enabled = data.integrationEnabled
    }
    const rows = await this.db
      .update(integrations)
      .set(updateData)
      .where(eq(integrations.integration_id, integrationId))
      .returning()
    return rows[0] as IntegrationRecord
  }

  async delete(integrationId: string): Promise<boolean> {
    await this.db.delete(integrations).where(eq(integrations.integration_id, integrationId))
    return true
  }
}
