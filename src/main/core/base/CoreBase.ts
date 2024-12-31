import Chalk from 'chalk'
import { formatQuery } from '@lib/SqlFormatterLib'

export class CoreBase {
  protected readonly className: string

  constructor() {
    this.className = this.constructor.name
  }

  protected logQuery(duration: number, query: string): void {
    const timestamp = new Date().toISOString()
    const formattedQuery = formatQuery(query).replace(/^/gm, '  ')

    console.debug(`${Chalk.cyanBright('[QUERY]')} [${timestamp}] [${duration}ms] \n`, formattedQuery)
  }

  protected logDebug(message: string | object): void {
    const timestamp = new Date().toISOString()

    if (typeof message === 'object') {
      console.debug(`${Chalk.magenta('[DEBUG]')} [${timestamp}] ${this.className}:`, message)
    } else {
      console.debug(`${Chalk.magenta('[DEBUG]')} [${timestamp}] ${this.className}: ${message}`)
    }
  }

  protected logInfo(message: string): void {
    const timestamp = new Date().toISOString()
    console.info(`${Chalk.blue('[INFO]')} [${timestamp}] ${this.className}: ${message}`)
  }

  protected logSuccess(message: string): void {
    const timestamp = new Date().toISOString()
    console.log(`${Chalk.green('[SUCCESS]')} [${timestamp}] ${this.className}: ${message}`)
  }

  protected logError(message: string): void {
    const timestamp = new Date().toISOString()
    console.error(`${Chalk.red('[ERROR]')} [${timestamp}] ${this.className}: ${message}`)
  }
}
