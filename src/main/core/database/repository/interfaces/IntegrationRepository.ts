// 인테그레이션 리포지토리 인터페이스

export interface CreateIntegrationData {
  integrationId: string
  integrationType: string
  integrationConfig: string
  integrationEnabled?: boolean
}

export interface IntegrationRecord {
  integration_id: string
  integration_type: string
  integration_config: string
  integration_enabled: boolean | null
  integration_created_at: Date | null
  integration_updated_at: Date | null
}

export interface IntegrationRepository {
  create(data: CreateIntegrationData): Promise<IntegrationRecord>
  findAll(): Promise<IntegrationRecord[]>
  findByType(type: string): Promise<IntegrationRecord | null>
  update(
    integrationId: string,
    data: { integrationConfig?: string; integrationEnabled?: boolean }
  ): Promise<IntegrationRecord>
  delete(integrationId: string): Promise<boolean>
}
