import { CoreBase } from '@base/CoreBase'
import { Prisma, PrismaClient } from '@prisma/client'

export class PrismaLib extends CoreBase {
  private prisma: PrismaClient<Prisma.PrismaClientOptions, 'query'>

  constructor() {
    super()
    this.prisma = new PrismaClient({
      log: [
        {
          emit: 'event',
          level: 'query'
        },
        {
          emit: 'stdout',
          level: 'error'
        },
        {
          emit: 'stdout',
          level: 'info'
        },
        {
          emit: 'stdout',
          level: 'warn'
        }
      ],
      errorFormat: 'pretty'
    })

    this.prisma.$on('query', (e) => {
      const params = JSON.parse(e.params) as string[]

      params.forEach((param, index) => {
        e.query = e.query.replace(`$${index + 1}`, typeof param === 'string' ? `'${param}'` : param)
      })

      this.logQuery(e.duration, e.query)
    })

    this.logInfo('Prisma client created')
  }

  public getPrismaClient() {
    return this.prisma
  }
}
