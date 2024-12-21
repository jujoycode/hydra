import { CoreBase } from '@base/CoreBase'
import { PrismaClient } from '@prisma/client'

export class PrismaLib extends CoreBase {
  private prisma: PrismaClient

  constructor() {
    super()
    this.prisma = this.createPrismaClient()
    this.logInfo('Prisma client created')
  }

  private createPrismaClient() {
    try {
      return new PrismaClient()
    } catch (error) {
      this.logError('Failed to create Prisma client')
      throw error
    }
  }

  public getPrismaClient() {
    return this.prisma
  }
}
