import { ipcMain } from 'electron/main'
import { BaseError } from '@/error/BaseError'
import { ErrorCode, type BaseErrorType } from '@/interface/CoreInterface'

/* Auth Handler */
import { DeleteUserHandler } from './auth/DeleteUserHandler'
import { SignInWithOtpHandler } from './auth/SignInWithOtpHandler'
import { VerifyOtpTokenHandler } from './auth/VerifyOtpTokenHandler'
import { UpdateUserHandler } from './auth/UpdateUserHandler'

/* Project Handler */
import { CreateProjectHandler } from './projects/CreateProjectHandler'
import { DeleteProjectHandler } from './projects/DeleteProjectHandler'
import { UpdateProjectHandler } from './projects/UpdateProjectHandler'

/* Issue Handler */
import { CreateIssueHandler } from './issues/CreateIssueHandler'
import { DeleteIssueHandler } from './issues/DeleteIssueHandler'
import { UpdateIssueHandler } from './issues/UpdateIssueHandler'

/* Storage Handler */
import { UploadFileHandler } from './storage/UploadFileHandler'

/* System Handler */
import { OpenExternalUrlHandler } from './system/OpenExternalUrlHandler'
import { OpenDialogHandler } from './system/OpenDialogHandler'

const handlers = {
  auth: [DeleteUserHandler, SignInWithOtpHandler, VerifyOtpTokenHandler, UpdateUserHandler],
  projects: [CreateProjectHandler, DeleteProjectHandler, UpdateProjectHandler],
  issues: [CreateIssueHandler, DeleteIssueHandler, UpdateIssueHandler],
  storage: [UploadFileHandler],
  system: [OpenExternalUrlHandler, OpenDialogHandler]
}

export function initHandler() {
  const handler = Object.values(handlers)
    .flat()
    .map((Handler) => new Handler())

  handler.forEach(({ ipcChannel, handler }) =>
    ipcMain.on(ipcChannel, async (_, params) => {
      try {
        const ipcReturn = await handler(params)
        _.reply(ipcChannel, ipcReturn)
      } catch (error: unknown) {
        console.error(`Error in handler for channel ${ipcChannel}:`, error)

        if (error instanceof BaseError) {
          _.reply(ipcChannel, {
            data: null,
            error: error.toJSON()
          })
        } else {
          // 정의되지 않은 에러 타입인 경우
          _.reply(ipcChannel, {
            data: null,
            error: {
              code: ErrorCode.UNKNOWN_ERROR,
              message: error instanceof Error ? error.message : 'An unknown error occurred',
              data: null
            } as BaseErrorType
          })
        }
      }
    })
  )
}
