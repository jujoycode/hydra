import { CoreBaseHandler } from '@/base/CoreBaseHandler'
import { IpcChannel, type ListIssueParams } from '@/interface/CoreInterface'

export class ListIssueHandler extends CoreBaseHandler<IpcChannel.ISSUE_LIST> {
  constructor() {
    super(IpcChannel.ISSUE_LIST)
  }

  async handler(params: ListIssueParams) {
    const hasFilters =
      params.status || params.priority || params.category || params.assignedTo || params.search || params.page

    if (!hasFilters) {
      const issues = await this.repos.issues.findByProject(params.projectId)
      return { data: issues, error: null }
    }

    const result = await this.repos.issues.findByProjectFiltered(params.projectId, {
      status: params.status,
      priority: params.priority,
      category: params.category,
      assignedTo: params.assignedTo,
      search: params.search,
      page: params.page,
      pageSize: params.pageSize,
      sortBy: params.sortBy,
      sortOrder: params.sortOrder
    })
    return { data: result.data, error: null }
  }
}
