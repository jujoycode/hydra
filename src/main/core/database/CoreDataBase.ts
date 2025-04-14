import { CoreBase } from '@base/CoreBase'
import { PrismaLib } from '@/lib/PrismaLib'
import {
  type CoreInterface,
  type PrismaClient,
  type ModelName,
  type ValidationRule,
  VALIDATION_TYPE
} from '@interface/CoreInterface'

export class CoreDataBase extends CoreBase implements CoreInterface {
  private static instance: CoreDataBase
  private prismaClient: PrismaClient

  private constructor() {
    super()
    this.logInfo('Initializing database instance')
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

  /**
   * validate
   * @param rule
   * @desc 데이터 중복 체크 / 개수 제한 검증 공용 메서드
   */
  public async validate<T extends ModelName>(rule: ValidationRule<T>): Promise<void> {
    const prismaClient = CoreDataBase.getInstance().getPrismaClient()

    const count = await (prismaClient[rule.model] as any).count({
      where: rule.where
    })

    if (rule.type === VALIDATION_TYPE.LIMIT && count >= (rule.limit ?? 0)) {
      throw new Error(`${rule.model} limit exceeded`)
    }

    if (rule.type === VALIDATION_TYPE.DUPLICATE && count > 0) {
      throw new Error(`Duplicate entry found in ${rule.model}`)
    }
  }
}
