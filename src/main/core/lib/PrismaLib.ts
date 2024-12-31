import { CoreBase } from '@base/CoreBase'
import { PrismaClient } from '@prisma/client'

export class PrismaLib extends CoreBase {
  private prisma: PrismaClient

  constructor() {
    super()
    this.prisma = new PrismaClient({
      log: ['error', 'warn', 'query', 'info'],
      errorFormat: 'pretty'
    })

    this.logInfo('Prisma client created')
  }
  public getPrismaClient() {
    return this.prisma
  }
}
