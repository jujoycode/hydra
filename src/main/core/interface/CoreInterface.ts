import type { SupabaseClient, VerifyEmailOtpParams, AuthOtpResponse, Session, AuthError } from '@supabase/supabase-js'
import type { PrismaClient, issues, projects, users, users_projects_link } from '@prisma/client'
import type { OpenDialogOptions, OpenDialogReturnValue } from 'electron'

export type {
  // Client
  SupabaseClient as SupaClient,
  PrismaClient,
  // Electron
  OpenDialogOptions,
  OpenDialogReturnValue,
  // Session
  Session,
  // API Response
  AuthOtpResponse,
  // Error
  AuthError,
  // DB Table
  users,
  issues,
  projects,
  users_projects_link
}

export type User = {
  id: string
  name: string | null
  email: string | null
  created_at: Date | null
  updated_at: Date | null
  avatar_key: string | null
}

export interface CoreInterface {
  getPrismaClient(): PrismaClient
}

export enum SUPABASE_CLIENT_TYPE {
  CLIENT = 'client',
  AUTH = 'auth',
  STORAGE = 'storage'
}

export type SupaAuthClient = SupabaseClient['auth']
export type SupaStorageClient = SupabaseClient['storage']
export interface AuthVerifyOtpTokenParams extends VerifyEmailOtpParams {
  type: 'email'
}

export type AuthVerifyOtpTokenResponse =
  | {
      data: {
        user: User | null
        session: Session | null
      }
      error: null
    }
  | {
      data: {
        user: null
        session: null
      }
      error: AuthError
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
  AUTH_SIGN_OUT = 'authSignOut',
  AUTH_GET_SESSION = 'authGetSession',
  // SYSTEM-
  SYSTEM_OPEN_EXTERNAL_URL = 'systemOpenExternalUrl',
  SYSTEM_OPEN_DIALOG = 'systemOpenDialog'
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
    receive: AuthVerifyOtpTokenResponse
  }
  [IpcChannel.AUTH_SIGN_OUT]: {
    send: AuthSignOutParams
    receive: void
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
  [IpcChannel.SYSTEM_OPEN_DIALOG]: {
    send: OpenDialogOptions
    receive: OpenDialogReturnValue
  }
}

/**
 * IpcRequest & IpcResponse
 * @desc Ipc 요청 및 응답 타입
 */
export type IpcRequest<T extends IpcChannel> = IpcPayloads[T]['send']
export type IpcResponse<T extends IpcChannel> = IpcPayloads[T]['receive']
