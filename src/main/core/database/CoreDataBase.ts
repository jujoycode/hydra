import { CoreBase } from '@base/CoreBase'
import { PrismaBaseUtil } from '@util/PrismaBaseUtil'
import { CoreInterface, PrisClient } from '@interface/CoreInterface'
export class CoreDataBase extends CoreBase implements CoreInterface {
  private static instance: CoreDataBase
  private prismaClient: PrisClient

  private constructor() {
    super()
    this.prismaClient = new PrismaBaseUtil().getPrismaClient()
  }

  public static getInstance(): CoreDataBase {
    if (!CoreDataBase.instance) {
      CoreDataBase.instance = new CoreDataBase()
    }

    return CoreDataBase.instance
  }

  public getPrismaClient(): PrisClient {
    return this.prismaClient
  }
}
