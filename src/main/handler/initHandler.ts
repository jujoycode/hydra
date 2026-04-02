import Chalk from 'chalk'
import { ipcMain } from 'electron/main'
import { BaseError } from '@/error/BaseError'
import { type BaseErrorType, ErrorCode } from '@/interface/CoreInterface'
import * as authHandlers from './auth'
import * as commentHandlers from './comments'
import * as integrationHandlers from './integrations'
import * as inviteHandlers from './invite'
import * as issueRelationHandlers from './issueRelations'
import * as issueHandlers from './issues'
import * as notificationHandlers from './notifications'
import * as labelHandlers from './labels'
import * as milestoneHandlers from './milestones'
import * as projectHandlers from './projects'
import * as storageHandlers from './storage'
import * as systemHandlers from './system'
import * as taskHandlers from './tasks'
import * as workspaceHandlers from './workspace'

const handlerModules = [
  authHandlers,
  commentHandlers,
  integrationHandlers,
  labelHandlers,
  milestoneHandlers,
  notificationHandlers,
  projectHandlers,
  issueRelationHandlers,
  issueHandlers,
  storageHandlers,
  systemHandlers,
  taskHandlers,
  workspaceHandlers,
  inviteHandlers
]

export function initHandler() {
  const allHandlers = handlerModules.flatMap((mod) => Object.values(mod)).map((Handler) => new Handler())

  allHandlers.forEach((instance) => {
    const { ipcChannel, handler } = instance
    const handlerName = instance.constructor.name

    ipcMain.handle(ipcChannel, async (_event, params) => {
      const start = Date.now()
      const timestamp = new Date().toISOString()
      console.debug(`${Chalk.magenta('[IPC]')} [${timestamp}] ${handlerName} called`, { channel: ipcChannel })

      try {
        const result = await handler(params)
        const duration = Date.now() - start
        console.debug(`${Chalk.green('[IPC]')} [${new Date().toISOString()}] ${handlerName} completed in ${duration}ms`)
        return result
      } catch (error: unknown) {
        const duration = Date.now() - start
        console.error(
          `${Chalk.red('[IPC]')} [${new Date().toISOString()}] ${handlerName} failed in ${duration}ms`,
          error
        )

        if (error instanceof BaseError) {
          return {
            data: null,
            error: error.toJSON()
          }
        }

        return {
          data: null,
          error: {
            code: ErrorCode.UNKNOWN_ERROR,
            message: error instanceof Error ? error.message : 'An unknown error occurred',
            data: null
          } as BaseErrorType
        }
      }
    })
  })
}
