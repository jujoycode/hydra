import type { IntegrationRecord } from '../../database/repository/interfaces/IntegrationRepository'

export type Integration = IntegrationRecord

export interface SaveIntegrationParams {
  integrationType: string
  integrationConfig: string
  integrationEnabled: boolean
}

export interface DeleteIntegrationParams {
  integrationId: string
}

export interface TestSlackWebhookParams {
  webhookUrl: string
}
