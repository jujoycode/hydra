import { CoreBaseHandler } from '@/base/CoreBaseHandler'
import { IpcChannel, type UpdateIssueParams } from '@/interface/CoreInterface'
import { CoreUtil } from '@/util/CoreUtil'

export class UpdateIssueHandler extends CoreBaseHandler<IpcChannel.ISSUE_UPDATE> {
  constructor() {
    super(IpcChannel.ISSUE_UPDATE)
  }

  async handler(params: UpdateIssueParams) {
    // 변경 전 상태(활동 로그 diff용) 확보
    const before = await this.repos.issues.findById(params.issueId)

    // 1. 이슈 업데이트 (public.issues)
    const issue = await this.repos.issues.update(params.issueId, {
      issueTitle: params.issueTitle,
      issueDesc: params.issueDesc,
      issueStatus: params.issueStatus,
      issuePriority: params.issuePriority,
      issueCategory: params.issueCategory,
      assignedTo: params.assignedTo,
      modifiedBy: params.userId
    })

    // 2. 활동 로그 기록 — best-effort (실패해도 업데이트는 성공시킨다)
    try {
      if (before && before.issue_status !== issue.issue_status) {
        await this.repos.activityLogs.create({
          activityId: CoreUtil.getUuid(),
          entityType: 'issue',
          entityId: issue.issue_id,
          action: 'status_changed',
          actorId: params.userId,
          metadata: JSON.stringify({ from: before.issue_status, to: issue.issue_status })
        })
      }
      if (before && before.issue_assigned_to !== issue.issue_assigned_to) {
        await this.repos.activityLogs.create({
          activityId: CoreUtil.getUuid(),
          entityType: 'issue',
          entityId: issue.issue_id,
          action: 'assigned',
          actorId: params.userId,
          metadata: JSON.stringify({ from: before.issue_assigned_to, to: issue.issue_assigned_to })
        })
      }
    } catch (error) {
      console.error('[activity] failed to record issue update', error)
    }

    return { data: issue, error: null }
  }
}
