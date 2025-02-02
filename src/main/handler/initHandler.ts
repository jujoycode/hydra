import { ipcMain } from 'electron/main'
import type { IpcChannel, IpcPayloads } from '@interface/CoreInterface'
import type { CoreBaseHandler } from '@base/CoreBaseHandler'
import type { BaseValidator } from '@util/validator/BaseValidator'

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
  const handler: CoreBaseHandler<IpcChannel, BaseValidator | null>[] = Object.values(handlers)
    .flat()
    .map((Handler) => new Handler())

  handler.forEach(({ ipcChannel, handler }) =>
    ipcMain.on(ipcChannel, async (_, params: IpcPayloads[IpcChannel]['send']) => {
      const ipcReturn = await handler(params)
      _.reply(ipcChannel, ipcReturn)
    })
  )
}
