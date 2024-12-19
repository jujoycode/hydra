import type { SupabaseClient, VerifyEmailOtpParams, AuthResponse, AuthOtpResponse, Session } from '@supabase/supabase-js'
import type { PrismaClient, issues, projects, users, users_projects_link } from '@prisma/client'

export interface CoreInterface {
  getPrismaClient(): PrismaClient
}

export type SupaAuthClient = SupabaseClient['auth']
export type SupaStorageClient = SupabaseClient['storage']
export interface AuthVerifyOtpTokenParams extends VerifyEmailOtpParams {
  type: 'email'
}

export type { SupabaseClient as SupaClient, PrismaClient, issues, projects, users, users_projects_link, AuthOtpResponse, AuthResponse, Session }


export interface AuthSignInWithOtpParams {
  email: string
}

export interface AuthSignOutParams {
  scope: 'global' | 'local' | 'others' | undefined
}

export interface AuthDeleteUserParams {
  id: string
  shouldSoftDelete: boolean
}

export interface AuthUpdateUserParams {
  data: Record<string, string>,
  phone?: string
}