import type {
  SupabaseClient,
  VerifyEmailOtpParams,
  AuthResponse,
  AuthOtpResponse,
  Session
} from '@supabase/supabase-js'
import type { PrismaClient, issues, projects, users, users_projects_link } from '@prisma/client'

export interface CoreInterface {
  getPrismaClient(): PrismaClient
}

export type SupaAuthClient = SupabaseClient['auth']
export type SupaStorageClient = SupabaseClient['storage']
export interface AuthVerifyOtpTokenParams extends VerifyEmailOtpParams {
  type: 'email'
}

export type {
  SupabaseClient as SupaClient,
  PrismaClient,
  issues,
  projects,
  users,
  users_projects_link,
  AuthOtpResponse,
  AuthResponse,
  Session
}

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
  data: Record<string, string>
  phone?: string
}

/**
 * IpcChannel
 * @desc Ipc 채널 정의
 */
export enum IpcChannel {
  AUTH_SIGN_IN_WITH_OTP = 'authSignInWithOtp'
}

/**
 * IpcPayloads
 * @desc Ipc 페이로드 정의
 */
export interface IpcPayloads {
  [IpcChannel.AUTH_SIGN_IN_WITH_OTP]: {
    send: AuthSignInWithOtpParams
    receive: AuthOtpResponse
  }
}

/**
 * IpcRequest & IpcResponse
 * @desc Ipc 요청 및 응답 타입
 */
export type IpcRequest<T extends IpcChannel> = IpcPayloads[T]['send']
export type IpcResponse<T extends IpcChannel> = IpcPayloads[T]['receive']
