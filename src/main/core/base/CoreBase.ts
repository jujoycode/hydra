import Chalk from 'chalk'

export class CoreBase {
  protected readonly className: string

  constructor() {
    this.className = this.constructor.name
  }

  protected logDebug(message: string): void {
    const timestamp = new Date().toISOString()
    console.debug(`[${Chalk.yellow('DEBUG')}] [${timestamp}] ${this.className}: ${message}`)
  }

  protected logInfo(message: string): void {
    const timestamp = new Date().toISOString()
    console.info(`[${Chalk.blue('INFO')}] [${timestamp}] ${this.className}: ${message}`)
  }

  protected logSuccess(message: string): void {
    const timestamp = new Date().toISOString()
    console.log(`[${Chalk.green('SUCCESS')}] [${timestamp}] ${this.className}: ${message}`)
  }

  protected logError(message: string): void {
    const timestamp = new Date().toISOString()
    console.error(`[${Chalk.red('ERROR')}] [${timestamp}] ${this.className}: ${message}`)
  }

  protected async safeExecute<T>(operation: () => Promise<T>, errorMessage: string): Promise<T | null> {
    try {
      return await operation()
    } catch (error) {
      this.logError(`${errorMessage}: ${error}`)

      return null
    }
  }
}
