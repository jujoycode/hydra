import type {
  SupabaseClient,
  VerifyEmailOtpParams,
  AuthResponse,
  AuthOtpResponse,
  User,
  Session,
  AuthError
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
  User,
  users,
  users_projects_link,
  AuthOtpResponse,
  AuthResponse,
  AuthError,
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

export interface OpenExternalUrlParams {
  url: string
}

/**
 * IpcChannel
 * @desc Ipc 채널 정의
 */
export enum IpcChannel {
  // AUTH-
  AUTH_SIGN_IN_WITH_OTP = 'authSignInWithOtp',
  AUTH_VERIFY_OTP_TOKEN = 'authVerifyOtpToken',
  AUTH_GET_SESSION = 'authGetSession',

  // SYSTEM-
  SYSTEM_OPEN_EXTERNAL_URL = 'systemOpenExternalUrl'
}

interface BaseIpcPayloads<SendType = unknown, ReceiveType = unknown> {
  [key: string]: {
    send: SendType
    receive: ReceiveType
  }
}

/**
 * IpcPayloads
 * @desc Ipc 페이로드 정의
 */
export interface IpcPayloads extends BaseIpcPayloads {
  // AUTH-
  [IpcChannel.AUTH_SIGN_IN_WITH_OTP]: {
    send: AuthSignInWithOtpParams
    receive: AuthOtpResponse
  }
  [IpcChannel.AUTH_VERIFY_OTP_TOKEN]: {
    send: AuthVerifyOtpTokenParams
    receive: AuthResponse
  }
  [IpcChannel.AUTH_GET_SESSION]: {
    send: undefined
    receive: Session
  }

  // SYSTEM-
  [IpcChannel.SYSTEM_OPEN_EXTERNAL_URL]: {
    send: OpenExternalUrlParams
    receive: void
  }
}

/**
 * IpcRequest & IpcResponse
 * @desc Ipc 요청 및 응답 타입
 */
export type IpcRequest<T extends IpcChannel> = IpcPayloads[T]['send']
export type IpcResponse<T extends IpcChannel> = IpcPayloads[T]['receive']
