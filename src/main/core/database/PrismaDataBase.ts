import { PrismaBaseUtil } from '@util/PrismaBaseUtil'
import type { PrisClient } from '@interface/CoreInterface'
import type { PrismaPromise } from '@prisma/client/runtime/library'

export class PrismaDataBase {
  public prismaClient: PrisClient

  constructor() {
    this.prismaClient = new PrismaBaseUtil().getPrismaClient()
  }

  public async startTransaction<T>(queries: PrismaPromise<T>[]): Promise<T[]> {
    try {
        return this.prismaClient.$transaction(queries)
    } catch (err: unknown) {
        const error = err as Error
        throw error
    }
  }

  public async disConnect(): Promise<void> {
    await this.prismaClient.$disconnect()
  }

  public getPrismaClient(): PrisClient {
    return this.prismaClient
  }
}
