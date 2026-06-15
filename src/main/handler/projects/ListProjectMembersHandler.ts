import { toSafeUser } from '@/auth/safeUser'
import { CoreBaseHandler } from '@/base/CoreBaseHandler'
import { IpcChannel, type ListProjectMembersParams } from '@/interface/CoreInterface'

export class ListProjectMembersHandler extends CoreBaseHandler<IpcChannel.PROJECT_LIST_MEMBERS> {
  constructor() {
    super(IpcChannel.PROJECT_LIST_MEMBERS)
  }

  async handler(params: ListProjectMembersParams) {
    const members = await this.repos.users.findByProject(params.projectId)
    return { data: members.map(toSafeUser), error: null }
  }
}
