import { CoreDataBase } from '@/database/CoreDataBase'
import { VALIDATION_TYPE, type ValidationRule, type ModelName } from '@/interface/CoreInterface'

export abstract class BaseValidator {
  protected readonly hydraDB: CoreDataBase
  protected readonly validationType = VALIDATION_TYPE

  constructor(hydraDB: CoreDataBase) {
    this.hydraDB = hydraDB
  }

  protected async validate<T extends ModelName>(options: ValidationRule<T>): Promise<void> {
    try {
      return await this.hydraDB.validate(options)
    } catch (error: any) {
      // ENHANCE: 커스텀 에러 처리 추가
      throw new Error(error.message)
    }
  }
}
