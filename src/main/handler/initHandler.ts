import { ipcMain } from 'electron/main'
import type { CoreBaseHandler } from '@base/CoreBaseHandler'

/* Auth Handler */
import { DeleteUserHandler } from './auth/DeleteUserHandler'
import { SignOutHandler } from './auth/SignOutHandler'
import { SignInWithOtpHandler } from './auth/SignInWithOtpHandler'
import { VerifyOtpTokenHandler } from './auth/VerifyOtpTokenHandler'
import { GetSessionHandler } from './auth/GetSessionHandler'
import { UpdateUserHandler } from './auth/UpdateUserHandler'

export function initHandler() {
  const handler: CoreBaseHandler[] = [
    new DeleteUserHandler(),
    new SignOutHandler(),
    new SignInWithOtpHandler(),
    new VerifyOtpTokenHandler(),
    new GetSessionHandler(),
    new UpdateUserHandler()
  ]

  handler.forEach(({ ipcChannel, handler }) =>
    ipcMain.on(ipcChannel, async (_, params: unknown) => {
      try {
        const ipcReturn = await handler(params)
        _.reply(ipcChannel, ipcReturn)
      } catch (error) {
        _.reply(ipcChannel, error)
      }
    })
  )
}
