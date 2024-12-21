import { CoreBase } from '@base/CoreBase'
import { PrismaLib } from '@lib/PrismaLib'
import { CoreInterface, PrismaClient } from '@interface/CoreInterface'

export class CoreDataBase extends CoreBase implements CoreInterface {
  private static instance: CoreDataBase
  private prismaClient: PrismaClient

  private constructor() {
    super()
    this.prismaClient = new PrismaLib().getPrismaClient()
  }

  public static getInstance(): CoreDataBase {
    if (!CoreDataBase.instance) {
      CoreDataBase.instance = new CoreDataBase()
    }

    return CoreDataBase.instance
  }

  public getPrismaClient(): PrismaClient {
    return this.prismaClient
  }
}
