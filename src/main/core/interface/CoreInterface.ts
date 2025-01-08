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

export enum VALIDATION_TYPE {
  LIMIT = 'limit',
  DUPLICATE = 'duplicate'
}

export type SupaAuthClient = SupabaseClient['auth']
export type SupaStorageClient = SupabaseClient['storage']

export type ModelName = 'users' | 'issues' | 'projects' | 'users_projects_link'

type ModelFields = {
  users: keyof users
  projects: keyof projects
  issues: keyof issues
  users_projects_link: keyof users_projects_link
}

export interface ValidationRule<T extends ModelName> {
  type: VALIDATION_TYPE
  model: T
  where?: Partial<Record<ModelFields[T], string | number>>
  limit?: number
}

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
  userId: string
  userName?: string
  userAvatarKey?: string | null
}

export interface OpenExternalUrlParams {
  url: string
}

export interface DeleteProjectParams {
  projectId: string
  userId: string
}

export interface CreateProjectParams {
  projectName: string
  projectDescription: string
  userId: string
}

export interface DeleteIssueParams {
  issueId: string
}

export type CreateIssueParams = UpdateIssueParams & {
  projectId: string
  issueKey: string
}

export type UpdateIssueParams = DeleteIssueParams & {
  issueTitle: string
  issueDesc: string
  userId: string
}

export type UpdateProjectParams = CreateProjectParams & DeleteProjectParams

export interface UploadFileParams {
  savePath: string
  file: ArrayBuffer
  fileOptions?: {
    /**
     * The number of seconds the asset is cached in the browser and in the Supabase CDN. This is set in the `Cache-Control: max-age=<seconds>` header. Defaults to 3600 seconds.
     */
    cacheControl?: string
    /**
     * the `Content-Type` header value. Should be specified if using a `fileBody` that is neither `Blob` nor `File` nor `FormData`, otherwise will default to `text/plain;charset=UTF-8`.
     */
    contentType?: string
    /**
     * When upsert is set to true, the file is overwritten if it exists. When set to false, an error is thrown if the object already exists. Defaults to false.
     */
    upsert?: boolean
  }
}

/**
 * IpcChannel
 * @desc Ipc 채널 정의
 */
export enum IpcChannel {
  // AUTH-
  AUTH_SIGN_IN_WITH_OTP = 'authSignInWithOtp',
  AUTH_VERIFY_OTP_TOKEN = 'authVerifyOtpToken',
  AUTH_UPDATE_USER = 'authUpdateUser',
  AUTH_DELETE_USER = 'authDeleteUser',

  // PROJECT-
  PROJECT_CREATE = 'projectCreate',
  PROJECT_UPDATE = 'projectUpdate',
  PROJECT_DELETE = 'projectDelete',

  // ISSUE-
  ISSUE_CREATE = 'issueCreate',
  ISSUE_UPDATE = 'issueUpdate',
  ISSUE_DELETE = 'issueDelete',

  // STORAGE-
  STORAGE_UPLOAD_FILE = 'storageUploadFile',

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
  [IpcChannel.AUTH_DELETE_USER]: {
    send: AuthDeleteUserParams
    receive: void
  }
  [IpcChannel.AUTH_UPDATE_USER]: {
    send: AuthUpdateUserParams
    receive: users
  }

  // PROJECT-
  [IpcChannel.PROJECT_CREATE]: {
    send: CreateProjectParams
    receive: projects
  }
  [IpcChannel.PROJECT_UPDATE]: {
    send: UpdateProjectParams
    receive: projects
  }
  [IpcChannel.PROJECT_DELETE]: {
    send: DeleteProjectParams
    receive: boolean
  }

  // ISSUE-
  [IpcChannel.ISSUE_CREATE]: {
    send: CreateIssueParams
    receive: issues
  }
  [IpcChannel.ISSUE_UPDATE]: {
    send: UpdateIssueParams
    receive: issues
  }
  [IpcChannel.ISSUE_DELETE]: {
    send: DeleteIssueParams
    receive: boolean
  }

  // STORAGE-
  [IpcChannel.STORAGE_UPLOAD_FILE]: {
    send: UploadFileParams
    receive: { id: string; path: string; fullPath: string }
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
