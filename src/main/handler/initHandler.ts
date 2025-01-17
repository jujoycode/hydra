import { ipcMain } from 'electron/main'
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

/* System Handler */
import { OpenExternalUrlHandler } from './system/OpenExternalUrlHandler'
import { OepnDialogHandler } from './system/OpenDialogHandler'

export function initHandler() {
  const handler: CoreBaseHandler<null | BaseValidator>[] = [
    new DeleteUserHandler(),
    new SignInWithOtpHandler(),
    new VerifyOtpTokenHandler(),
    new UpdateUserHandler(),
    new OpenExternalUrlHandler(),
    new OepnDialogHandler(),
    new CreateProjectHandler(),
    new UpdateProjectHandler(),
    new DeleteProjectHandler(),
    new CreateIssueHandler(),
    new UpdateIssueHandler(),
    new DeleteIssueHandler()
  ]

  handler.forEach(({ ipcChannel, handler }) =>
    ipcMain.on(ipcChannel, async (_, params: unknown) => {
      const ipcReturn = await handler(params)
      _.reply(ipcChannel, ipcReturn)
    })
  )
}
