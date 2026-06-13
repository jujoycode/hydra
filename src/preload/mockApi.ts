// TEMP(디자인 미리보기): DB 없이 UI를 채우기 위한 mock callApi 디스패처.
// 정식 인증/연결 복구 시 이 파일과 preload/index.ts의 MOCK 분기를 함께 제거한다.
import { IpcChannel } from '@/interface/CoreInterface'

type Envelope = { data: unknown; error: null }
const ok = (data: unknown): Envelope => ({ data, error: null })
const d = (s: string): Date => new Date(s)

// ── 사용자 ────────────────────────────────────────────────
const USERS = [
  {
    user_id: 'preview-admin',
    user_name: 'Preview Admin',
    user_email: 'preview@hydra.local',
    user_avatar_path: null,
    user_role: 'admin' as const,
    user_created_at: d('2026-01-02T09:00:00Z'),
    user_updated_at: d('2026-05-20T09:00:00Z')
  },
  {
    user_id: 'u-2',
    user_name: 'Jiyu Yoo',
    user_email: 'jiyu@hydra.local',
    user_avatar_path: null,
    user_role: 'member' as const,
    user_created_at: d('2026-02-10T09:00:00Z'),
    user_updated_at: d('2026-05-18T09:00:00Z')
  },
  {
    user_id: 'u-3',
    user_name: 'Alex Kim',
    user_email: 'alex@hydra.local',
    user_avatar_path: null,
    user_role: 'member' as const,
    user_created_at: d('2026-03-05T09:00:00Z'),
    user_updated_at: d('2026-05-12T09:00:00Z')
  }
]

// ── 프로젝트 ──────────────────────────────────────────────
const PROJECTS = [
  {
    project_id: 'p-1',
    project_name: 'Hydra Core',
    project_key: 'HYDRA',
    project_desc: '오프라인 우선 이슈 트래커의 코어 데스크톱 앱',
    project_created_by: 'preview-admin',
    project_modified_by: 'preview-admin',
    project_start_date: d('2026-01-05T00:00:00Z'),
    project_end_date: d('2026-07-01T00:00:00Z')
  },
  {
    project_id: 'p-2',
    project_name: 'Marketing Website',
    project_key: 'MKT',
    project_desc: '공개 랜딩 페이지와 문서 사이트',
    project_created_by: 'u-3',
    project_modified_by: 'u-3',
    project_start_date: d('2026-03-01T00:00:00Z'),
    project_end_date: null
  },
  {
    project_id: 'p-3',
    project_name: 'Mobile App',
    project_key: 'MOB',
    project_desc: 'iOS/Android 동반 앱',
    project_created_by: 'preview-admin',
    project_modified_by: 'u-2',
    project_start_date: d('2026-04-15T00:00:00Z'),
    project_end_date: null
  }
]

// ── 이슈 ──────────────────────────────────────────────────
const mkIssue = (
  id: string,
  projectId: string,
  key: string,
  title: string,
  status: string,
  priority: string,
  category: string,
  assignedTo: string,
  milestoneId: string | null,
  createdAt: string
) => ({
  issue_id: id,
  project_id: projectId,
  issue_title: title,
  issue_key: key,
  issue_desc: `${title} — 상세 설명(미리보기 데이터).`,
  issue_status: status,
  issue_priority: priority,
  issue_category: category,
  issue_created_by: 'preview-admin',
  issue_modified_by: assignedTo,
  issue_assigned_to: assignedTo,
  issue_milestone_id: milestoneId,
  issue_created_at: d(createdAt),
  issue_updated_at: d('2026-05-25T09:00:00Z')
})

const ISSUES = [
  mkIssue(
    'i-1',
    'p-1',
    'HYDRA-1',
    'Login flow crashes on empty DB',
    'blocked',
    'urgent',
    'bug',
    'preview-admin',
    'm-1',
    '2026-05-01T09:00:00Z'
  ),
  mkIssue(
    'i-2',
    'p-1',
    'HYDRA-2',
    'Implement dependency arrows',
    'in_progress',
    'high',
    'feature',
    'u-2',
    'm-1',
    '2026-05-03T09:00:00Z'
  ),
  mkIssue(
    'i-3',
    'p-1',
    'HYDRA-3',
    'Dark mode contrast audit',
    'review',
    'medium',
    'feature',
    'preview-admin',
    'm-1',
    '2026-05-06T09:00:00Z'
  ),
  mkIssue(
    'i-4',
    'p-1',
    'HYDRA-4',
    'Add semantic design tokens',
    'done',
    'high',
    'feature',
    'u-3',
    'm-2',
    '2026-04-20T09:00:00Z'
  ),
  mkIssue(
    'i-5',
    'p-1',
    'HYDRA-5',
    'Backlog grooming pass',
    'backlog',
    'low',
    'feature',
    'u-2',
    null,
    '2026-05-10T09:00:00Z'
  ),
  mkIssue(
    'i-6',
    'p-1',
    'HYDRA-6',
    'Notifications polish',
    'backlog',
    'medium',
    'feature',
    'preview-admin',
    null,
    '2026-05-12T09:00:00Z'
  ),
  mkIssue(
    'i-7',
    'p-2',
    'MKT-1',
    'Landing hero copy',
    'in_progress',
    'medium',
    'feature',
    'u-3',
    'm-3',
    '2026-05-04T09:00:00Z'
  ),
  mkIssue('i-8', 'p-2', 'MKT-2', 'SEO meta tags', 'done', 'low', 'feature', 'u-2', null, '2026-04-28T09:00:00Z'),
  mkIssue(
    'i-9',
    'p-2',
    'MKT-3',
    'Broken pricing link',
    'blocked',
    'high',
    'bug',
    'preview-admin',
    'm-3',
    '2026-05-09T09:00:00Z'
  ),
  mkIssue(
    'i-10',
    'p-3',
    'MOB-1',
    'Push notifications',
    'backlog',
    'high',
    'feature',
    'u-3',
    null,
    '2026-05-11T09:00:00Z'
  ),
  mkIssue(
    'i-11',
    'p-3',
    'MOB-2',
    'Crash on cold start',
    'in_progress',
    'urgent',
    'bug',
    'preview-admin',
    null,
    '2026-05-14T09:00:00Z'
  )
]

// ── 마일스톤 ──────────────────────────────────────────────
const MILESTONES = [
  {
    milestone_id: 'm-1',
    project_id: 'p-1',
    milestone_title: 'v1.0 Release',
    milestone_desc: '첫 공개 릴리스',
    milestone_due_date: d('2026-07-01T00:00:00Z'),
    milestone_status: 'open',
    milestone_created_at: d('2026-04-01T09:00:00Z'),
    milestone_updated_at: d('2026-05-20T09:00:00Z')
  },
  {
    milestone_id: 'm-2',
    project_id: 'p-1',
    milestone_title: 'Design System',
    milestone_desc: '토큰·컴포넌트 정비',
    milestone_due_date: d('2026-05-15T00:00:00Z'),
    milestone_status: 'done',
    milestone_created_at: d('2026-03-15T09:00:00Z'),
    milestone_updated_at: d('2026-05-15T09:00:00Z')
  },
  {
    milestone_id: 'm-3',
    project_id: 'p-2',
    milestone_title: 'Q3 Campaign',
    milestone_desc: '여름 캠페인',
    milestone_due_date: d('2026-08-01T00:00:00Z'),
    milestone_status: 'open',
    milestone_created_at: d('2026-04-10T09:00:00Z'),
    milestone_updated_at: d('2026-05-10T09:00:00Z')
  }
]

// ── 태스크(서브태스크) ────────────────────────────────────
const TASKS = [
  {
    task_id: 't-1',
    issue_id: 'i-2',
    task_title: 'Define arrow tokens',
    task_completed: true,
    task_order: 1,
    task_created_by: 'u-2',
    task_created_at: d('2026-05-03T10:00:00Z'),
    task_updated_at: d('2026-05-04T10:00:00Z')
  },
  {
    task_id: 't-2',
    issue_id: 'i-2',
    task_title: 'Render SVG arrows',
    task_completed: false,
    task_order: 2,
    task_created_by: 'u-2',
    task_created_at: d('2026-05-03T10:05:00Z'),
    task_updated_at: d('2026-05-03T10:05:00Z')
  },
  {
    task_id: 't-3',
    issue_id: 'i-2',
    task_title: 'Wire relation API',
    task_completed: false,
    task_order: 3,
    task_created_by: 'u-2',
    task_created_at: d('2026-05-03T10:10:00Z'),
    task_updated_at: d('2026-05-03T10:10:00Z')
  }
]

// ── 댓글 ──────────────────────────────────────────────────
const COMMENTS = [
  {
    comment_id: 'c-1',
    issue_id: 'i-1',
    comment_content: '빈 DB에서 재현됩니다. 스택트레이스 첨부할게요.',
    comment_created_by: 'u-2',
    comment_updated_by: null,
    comment_created_at: d('2026-05-02T08:00:00Z'),
    comment_updated_at: d('2026-05-02T08:00:00Z')
  },
  {
    comment_id: 'c-2',
    issue_id: 'i-1',
    comment_content: '임시 우회책: 인증 게이트를 미리보기 모드로 건너뜁니다.',
    comment_created_by: 'preview-admin',
    comment_updated_by: null,
    comment_created_at: d('2026-05-02T11:30:00Z'),
    comment_updated_at: d('2026-05-02T11:30:00Z')
  }
]

// ── 라벨 ──────────────────────────────────────────────────
const LABELS = [
  { label_id: 'l-1', label_name: 'Bug', label_color: '#ef4444', label_created_at: d('2026-01-10T09:00:00Z') },
  { label_id: 'l-2', label_name: 'Feature', label_color: '#3b82f6', label_created_at: d('2026-01-10T09:00:00Z') },
  { label_id: 'l-3', label_name: 'UI', label_color: '#8b5cf6', label_created_at: d('2026-01-10T09:00:00Z') },
  { label_id: 'l-4', label_name: 'Backend', label_color: '#10b981', label_created_at: d('2026-01-10T09:00:00Z') }
]
const LABELS_BY_ISSUE: Record<string, typeof LABELS> = {
  'i-1': [LABELS[0], LABELS[2]],
  'i-2': [LABELS[1], LABELS[2]],
  'i-4': [LABELS[1], LABELS[3]]
}

// ── 이슈 관계 ─────────────────────────────────────────────
const RELATIONS = [
  {
    relation_id: 'r-1',
    source_issue_id: 'i-1',
    target_issue_id: 'i-2',
    relation_type: 'blocks',
    relation_created_at: d('2026-05-03T09:00:00Z')
  },
  {
    relation_id: 'r-2',
    source_issue_id: 'i-1',
    target_issue_id: 'i-3',
    relation_type: 'relates_to',
    relation_created_at: d('2026-05-06T09:00:00Z')
  }
]

// ── 알림 ──────────────────────────────────────────────────
const NOTIFICATIONS = [
  {
    notification_id: 'n-1',
    user_id: 'preview-admin',
    notification_type: 'comment',
    notification_title: 'HYDRA-1에 새 댓글',
    notification_message: 'Jiyu Yoo: 빈 DB에서 재현됩니다.',
    notification_read: false,
    notification_link: '/projects/p-1/issues/i-1',
    notification_created_at: d('2026-05-25T08:05:00Z')
  },
  {
    notification_id: 'n-2',
    user_id: 'preview-admin',
    notification_type: 'member',
    notification_title: 'Alex Kim님이 워크스페이스에 합류',
    notification_message: null,
    notification_read: false,
    notification_link: '/members',
    notification_created_at: d('2026-05-24T15:00:00Z')
  },
  {
    notification_id: 'n-3',
    user_id: 'preview-admin',
    notification_type: 'target',
    notification_title: 'HYDRA-3가 회원님에게 할당됨',
    notification_message: 'Dark mode contrast audit',
    notification_read: false,
    notification_link: '/projects/p-1/issues/i-3',
    notification_created_at: d('2026-05-23T10:00:00Z')
  },
  {
    notification_id: 'n-4',
    user_id: 'preview-admin',
    notification_type: 'system',
    notification_title: '워크스페이스 백업 완료',
    notification_message: null,
    notification_read: true,
    notification_link: null,
    notification_created_at: d('2026-05-22T02:00:00Z')
  }
]

const asRecord = (v: unknown): Record<string, unknown> =>
  v && typeof v === 'object' ? (v as Record<string, unknown>) : {}

/**
 * 채널별 mock 응답. 모든 채널은 항상 envelope를 반환하므로 실제 IPC로 떨어지지 않는다.
 */
export function getMockResponse(channel: IpcChannel, data?: unknown): Envelope {
  const req = asRecord(data)
  switch (channel) {
    // workspace / auth
    case IpcChannel.WORKSPACE_STATUS:
      return ok({ connected: true, user: USERS[0], isFirstLogin: false })
    case IpcChannel.WORKSPACE_LIST:
      return ok([
        {
          id: 'ws-preview',
          name: 'Preview Workspace',
          host: 'localhost',
          port: 5432,
          dbName: 'hydra',
          username: 'postgres'
        }
      ])
    case IpcChannel.AUTH_LIST_USERS:
      return ok(USERS)
    case IpcChannel.AUTH_UPDATE_USER:
      return ok({ ...USERS[0], ...req })
    case IpcChannel.AUTH_CREATE_MEMBER:
      return ok({
        ...USERS[1],
        user_id: `u-new-${String(req.userName ?? 'member')}`,
        user_name: req.userName ?? 'New Member',
        user_email: req.userEmail ?? ''
      })
    case IpcChannel.AUTH_DELETE_USER:
      return ok(null)

    // projects
    case IpcChannel.PROJECT_LIST:
      return ok(PROJECTS)
    case IpcChannel.PROJECT_GET:
      return ok(PROJECTS.find((p) => p.project_id === req.projectId) ?? PROJECTS[0])
    case IpcChannel.PROJECT_CREATE:
      return ok({
        ...PROJECTS[0],
        project_id: `p-new`,
        project_name: req.projectName ?? 'New Project',
        project_key: req.projectKey ?? 'NEW'
      })
    case IpcChannel.PROJECT_UPDATE:
      return ok({ ...PROJECTS[0], ...req })
    case IpcChannel.PROJECT_DELETE:
      return ok(true)

    // issues
    case IpcChannel.ISSUE_LIST: {
      let list = ISSUES.filter((i) => i.project_id === req.projectId)
      if (req.assignedTo) list = list.filter((i) => i.issue_assigned_to === req.assignedTo)
      return ok(list)
    }
    case IpcChannel.ISSUE_GET:
      return ok(ISSUES.find((i) => i.issue_id === req.issueId) ?? ISSUES[0])
    case IpcChannel.ISSUE_CREATE:
      return ok({ ...ISSUES[0], issue_id: 'i-new', issue_title: req.issueTitle ?? 'New Issue' })
    case IpcChannel.ISSUE_UPDATE: {
      const found = ISSUES.find((i) => i.issue_id === req.issueId) ?? ISSUES[0]
      return ok({ ...found, ...req })
    }
    case IpcChannel.ISSUE_DELETE:
      return ok(true)

    // relations
    case IpcChannel.ISSUE_RELATION_LIST:
      return ok(RELATIONS.filter((r) => r.source_issue_id === req.issueId || r.target_issue_id === req.issueId))
    case IpcChannel.ISSUE_RELATION_CREATE:
      return ok({
        relation_id: 'r-new',
        source_issue_id: req.sourceIssueId ?? 'i-1',
        target_issue_id: req.targetIssueId ?? 'i-2',
        relation_type: req.relationType ?? 'relates_to',
        relation_created_at: d('2026-05-25T09:00:00Z')
      })
    case IpcChannel.ISSUE_RELATION_DELETE:
      return ok(true)

    // comments
    case IpcChannel.COMMENT_LIST:
      return ok(COMMENTS.filter((c) => c.issue_id === req.issueId))
    case IpcChannel.COMMENT_CREATE:
      return ok({
        comment_id: 'c-new',
        issue_id: req.issueId ?? 'i-1',
        comment_content: req.content ?? req.commentContent ?? '',
        comment_created_by: 'preview-admin',
        comment_updated_by: null,
        comment_created_at: d('2026-05-25T12:00:00Z'),
        comment_updated_at: d('2026-05-25T12:00:00Z')
      })
    case IpcChannel.COMMENT_UPDATE:
      return ok({ ...COMMENTS[0], ...req })
    case IpcChannel.COMMENT_DELETE:
      return ok(true)

    // labels
    case IpcChannel.LABEL_LIST:
      return ok(LABELS)
    case IpcChannel.LABEL_LIST_BY_ISSUE:
      return ok(LABELS_BY_ISSUE[String(req.issueId)] ?? [])
    case IpcChannel.LABEL_CREATE:
      return ok({
        label_id: 'l-new',
        label_name: req.labelName ?? 'New',
        label_color: req.labelColor ?? '#64748b',
        label_created_at: d('2026-05-25T09:00:00Z')
      })
    case IpcChannel.LABEL_UPDATE:
      return ok({ ...LABELS[0], ...req })
    case IpcChannel.LABEL_DELETE:
    case IpcChannel.LABEL_LINK:
    case IpcChannel.LABEL_UNLINK:
      return ok(true)

    // milestones
    case IpcChannel.MILESTONE_LIST:
      return ok(MILESTONES.filter((m) => m.project_id === req.projectId))
    case IpcChannel.MILESTONE_CREATE:
      return ok({
        milestone_id: 'm-new',
        project_id: req.projectId ?? 'p-1',
        milestone_title: req.milestoneTitle ?? req.title ?? 'New Milestone',
        milestone_desc: null,
        milestone_due_date: null,
        milestone_status: 'open',
        milestone_created_at: d('2026-05-25T09:00:00Z'),
        milestone_updated_at: d('2026-05-25T09:00:00Z')
      })
    case IpcChannel.MILESTONE_UPDATE:
      return ok({ ...MILESTONES[0], ...req })
    case IpcChannel.MILESTONE_DELETE:
      return ok(true)

    // tasks
    case IpcChannel.TASK_LIST:
      return ok(TASKS.filter((t) => t.issue_id === req.issueId))
    case IpcChannel.TASK_CREATE:
      return ok({
        task_id: 't-new',
        issue_id: req.issueId ?? 'i-2',
        task_title: req.taskTitle ?? req.title ?? 'New Task',
        task_completed: false,
        task_order: 99,
        task_created_by: 'preview-admin',
        task_created_at: d('2026-05-25T09:00:00Z'),
        task_updated_at: d('2026-05-25T09:00:00Z')
      })
    case IpcChannel.TASK_UPDATE:
      return ok({ ...TASKS[0], ...req })
    case IpcChannel.TASK_DELETE:
      return ok(true)

    // notifications
    case IpcChannel.NOTIFICATION_LIST:
      return ok(NOTIFICATIONS)
    case IpcChannel.NOTIFICATION_COUNT_UNREAD:
      return ok(NOTIFICATIONS.filter((n) => !n.notification_read).length)
    case IpcChannel.NOTIFICATION_MARK_READ:
      return ok({ ...NOTIFICATIONS[0], notification_read: true })
    case IpcChannel.NOTIFICATION_MARK_ALL_READ:
      return ok(true)
    case IpcChannel.NOTIFICATION_DELETE:
      return ok(true)

    // integrations
    case IpcChannel.INTEGRATION_LIST:
      return ok([])
    case IpcChannel.INTEGRATION_SAVE:
      return ok({
        integration_id: 'int-new',
        integration_type: req.integrationType ?? 'slack',
        integration_config: '{}',
        integration_enabled: true,
        integration_created_at: d('2026-05-25T09:00:00Z'),
        integration_updated_at: d('2026-05-25T09:00:00Z')
      })
    case IpcChannel.INTEGRATION_DELETE:
    case IpcChannel.INTEGRATION_TEST_SLACK:
      return ok(true)

    // storage
    case IpcChannel.STORAGE_LIST_ISSUE_FILES:
      return ok([])
    case IpcChannel.STORAGE_LINK_FILE:
    case IpcChannel.STORAGE_UNLINK_FILE:
      return ok(true)

    // invite
    case IpcChannel.INVITE_GENERATE:
      return ok({ code: 'PREVIEW-INVITE-CODE' })

    default:
      // 미지정 채널은 빈 성공 응답
      return ok(null)
  }
}
