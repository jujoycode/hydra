import type { SupabaseClient } from '@supabase/supabase-js'
import type { PrismaClient, issues, projects, users, users_projects_link } from '@prisma/client'



export interface CoreInterface {
  getPrismaClient(): PrismaClient
  getSupabaseClient(): SupabaseClient
}

export type SupaAuthClient = SupabaseClient['auth']
export type {
  SupabaseClient as SupaClient,
  PrismaClient as PrisClient ,
  issues,
  projects,
  users,
  users_projects_link
}