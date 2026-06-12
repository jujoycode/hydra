// Drizzle ORM 스키마 정의 - MySQL 8 (schema.ts 의 PG 스키마와 테이블/컬럼명 패리티 유지 — schema.parity.test.ts)
// 타입 매핑 규칙은 스펙 §6.2: uuid→char(36, ascii_bin은 마이그레이션 SQL에서), timestamp→datetime(3), TEXT-UNIQUE→varchar-UNIQUE

import { sql } from 'drizzle-orm'
import { boolean, char, datetime, index, int, mysqlTable, text, varchar } from 'drizzle-orm/mysql-core'

const now3 = sql`CURRENT_TIMESTAMP(3)`

// 사용자 테이블
export const users = mysqlTable('users', {
  user_id: char('user_id', { length: 36 }).primaryKey(),
  user_sn: varchar('user_sn', { length: 255 }).notNull().unique(),
  user_password_hash: varchar('user_password_hash', { length: 255 }).notNull(),
  user_status: varchar('user_status', { length: 20 }).default('active'),
  user_name: varchar('user_name', { length: 255 }),
  user_email: varchar('user_email', { length: 255 }),
  user_db_role: varchar('user_db_role', { length: 255 }),
  user_avatar_path: varchar('user_avatar_path', { length: 1024 }),
  user_role: varchar('user_role', { length: 50 }).default('member'),
  user_created_at: datetime('user_created_at', { fsp: 3 }),
  user_updated_at: datetime('user_updated_at', { fsp: 3 })
})

// 프로젝트 테이블 (project_key: TEXT-UNIQUE 불가 → varchar(50) UNIQUE, 스펙 §6.2.3)
export const projects = mysqlTable('projects', {
  project_id: char('project_id', { length: 36 }).primaryKey(),
  project_name: text('project_name').notNull(),
  project_key: varchar('project_key', { length: 50 }).notNull().unique(),
  project_desc: text('project_desc'),
  project_created_by: char('project_created_by', { length: 36 }),
  project_modified_by: char('project_modified_by', { length: 36 }),
  project_start_date: datetime('project_start_date', { fsp: 3 }),
  project_end_date: datetime('project_end_date', { fsp: 3 })
})

// 사용자-프로젝트 연결 테이블
export const usersProjectsLink = mysqlTable(
  'users_projects_link',
  {
    user_project_link_id: char('user_project_link_id', { length: 36 }).primaryKey(),
    user_id: char('user_id', { length: 36 }).references(() => users.user_id),
    project_id: char('project_id', { length: 36 }).references(() => projects.project_id)
  },
  (t) => [
    index('idx_users_projects_link_user').on(t.user_id),
    index('idx_users_projects_link_project').on(t.project_id)
  ]
)

// 마일스톤 테이블
export const milestones = mysqlTable(
  'milestones',
  {
    milestone_id: char('milestone_id', { length: 36 }).primaryKey(),
    project_id: char('project_id', { length: 36 })
      .notNull()
      .references(() => projects.project_id),
    milestone_title: text('milestone_title').notNull(),
    milestone_desc: text('milestone_desc'),
    milestone_due_date: datetime('milestone_due_date', { fsp: 3 }),
    milestone_status: varchar('milestone_status', { length: 50 }).default('open'),
    milestone_created_at: datetime('milestone_created_at', { fsp: 3 }).default(now3),
    milestone_updated_at: datetime('milestone_updated_at', { fsp: 3 }).default(now3)
  },
  (t) => [index('idx_milestones_project_id').on(t.project_id)]
)

// 이슈 테이블
export const issues = mysqlTable(
  'issues',
  {
    issue_id: char('issue_id', { length: 36 }).primaryKey(),
    project_id: char('project_id', { length: 36 })
      .notNull()
      .references(() => projects.project_id),
    issue_title: text('issue_title').notNull(),
    issue_key: text('issue_key').notNull(),
    issue_desc: text('issue_desc'),
    issue_status: varchar('issue_status', { length: 50 }),
    issue_priority: varchar('issue_priority', { length: 50 }),
    issue_category: varchar('issue_category', { length: 100 }),
    issue_created_by: char('issue_created_by', { length: 36 }),
    issue_modified_by: char('issue_modified_by', { length: 36 }),
    issue_assigned_to: char('issue_assigned_to', { length: 36 }),
    issue_milestone_id: char('issue_milestone_id', { length: 36 }).references(() => milestones.milestone_id),
    issue_created_at: datetime('issue_created_at', { fsp: 3 }).default(now3),
    issue_updated_at: datetime('issue_updated_at', { fsp: 3 }).default(now3)
  },
  (t) => [
    index('idx_issues_project_id').on(t.project_id),
    index('idx_issues_assigned_to').on(t.issue_assigned_to),
    index('idx_issues_milestone_id').on(t.issue_milestone_id)
  ]
)

// 파일 테이블
export const files = mysqlTable('files', {
  file_id: char('file_id', { length: 36 }).primaryKey(),
  file_name: text('file_name').notNull(),
  file_path: text('file_path').notNull(),
  file_type: text('file_type').notNull(),
  file_size: int('file_size'),
  file_created_at: datetime('file_created_at', { fsp: 3 }).default(now3),
  file_updated_at: datetime('file_updated_at', { fsp: 3 }).default(now3)
})

// 이슈-파일 연결 테이블
export const issuesFilesLink = mysqlTable(
  'issues_files_link',
  {
    issue_file_link_id: char('issue_file_link_id', { length: 36 }).primaryKey(),
    issue_id: char('issue_id', { length: 36 }).references(() => issues.issue_id),
    file_id: char('file_id', { length: 36 }).references(() => files.file_id)
  },
  (t) => [index('idx_issues_files_link_issue').on(t.issue_id), index('idx_issues_files_link_file').on(t.file_id)]
)

// 댓글 테이블
export const comments = mysqlTable(
  'comments',
  {
    comment_id: char('comment_id', { length: 36 }).primaryKey(),
    issue_id: char('issue_id', { length: 36 })
      .notNull()
      .references(() => issues.issue_id),
    comment_content: text('comment_content').notNull(),
    comment_created_by: char('comment_created_by', { length: 36 }),
    comment_updated_by: char('comment_updated_by', { length: 36 }),
    comment_created_at: datetime('comment_created_at', { fsp: 3 }).default(now3),
    comment_updated_at: datetime('comment_updated_at', { fsp: 3 }).default(now3)
  },
  (t) => [index('idx_comments_issue_id').on(t.issue_id)]
)

// 라벨 테이블
export const labels = mysqlTable('labels', {
  label_id: char('label_id', { length: 36 }).primaryKey(),
  label_name: varchar('label_name', { length: 100 }).notNull(),
  label_color: varchar('label_color', { length: 7 }).notNull(),
  label_created_at: datetime('label_created_at', { fsp: 3 }).default(now3)
})

// 이슈-라벨 연결 테이블
export const issuesLabelsLink = mysqlTable(
  'issues_labels_link',
  {
    issue_label_link_id: char('issue_label_link_id', { length: 36 }).primaryKey(),
    issue_id: char('issue_id', { length: 36 }).references(() => issues.issue_id),
    label_id: char('label_id', { length: 36 }).references(() => labels.label_id)
  },
  (t) => [index('idx_issues_labels_link_issue').on(t.issue_id), index('idx_issues_labels_link_label').on(t.label_id)]
)

// 태스크 테이블
export const tasks = mysqlTable(
  'tasks',
  {
    task_id: char('task_id', { length: 36 }).primaryKey(),
    issue_id: char('issue_id', { length: 36 }).references(() => issues.issue_id),
    task_title: text('task_title').notNull(),
    task_completed: boolean('task_completed').default(false),
    task_order: int('task_order').default(0),
    task_created_by: char('task_created_by', { length: 36 }),
    task_created_at: datetime('task_created_at', { fsp: 3 }).default(now3),
    task_updated_at: datetime('task_updated_at', { fsp: 3 }).default(now3)
  },
  (t) => [index('idx_tasks_issue_id').on(t.issue_id)]
)

// 이슈 관계 테이블
export const issueRelations = mysqlTable(
  'issue_relations',
  {
    relation_id: char('relation_id', { length: 36 }).primaryKey(),
    source_issue_id: char('source_issue_id', { length: 36 })
      .notNull()
      .references(() => issues.issue_id),
    target_issue_id: char('target_issue_id', { length: 36 })
      .notNull()
      .references(() => issues.issue_id),
    relation_type: varchar('relation_type', { length: 50 }).notNull(),
    relation_created_at: datetime('relation_created_at', { fsp: 3 }).default(now3)
  },
  (t) => [
    index('idx_issue_relations_source').on(t.source_issue_id),
    index('idx_issue_relations_target').on(t.target_issue_id)
  ]
)

// 알림 테이블
export const notifications = mysqlTable(
  'notifications',
  {
    notification_id: char('notification_id', { length: 36 }).primaryKey(),
    user_id: char('user_id', { length: 36 })
      .notNull()
      .references(() => users.user_id),
    notification_type: varchar('notification_type', { length: 50 }).notNull(),
    notification_title: text('notification_title').notNull(),
    notification_message: text('notification_message'),
    notification_read: boolean('notification_read').default(false),
    notification_link: text('notification_link'),
    notification_created_at: datetime('notification_created_at', { fsp: 3 }).default(now3)
  },
  (t) => [index('idx_notifications_user_id').on(t.user_id)]
)

// 인테그레이션 설정 테이블
export const integrations = mysqlTable('integrations', {
  integration_id: char('integration_id', { length: 36 }).primaryKey(),
  integration_type: varchar('integration_type', { length: 50 }).notNull(),
  integration_config: text('integration_config').notNull(),
  integration_enabled: boolean('integration_enabled').default(false),
  integration_created_at: datetime('integration_created_at', { fsp: 3 }).default(now3),
  integration_updated_at: datetime('integration_updated_at', { fsp: 3 }).default(now3)
})

// 초대 코드 테이블 (code: TEXT-UNIQUE 불가 + 조회되지 않는 컬럼 → UNIQUE 없이 저장만, 스펙 §6.2.3)
export const inviteCodes = mysqlTable('invite_codes', {
  invite_code_id: char('invite_code_id', { length: 36 }).primaryKey(),
  code: text('code').notNull(),
  workspace_name: text('workspace_name').notNull(),
  host: text('host').notNull(),
  port: int('port').notNull(),
  db_name: text('db_name').notNull(),
  created_by: text('created_by'),
  created_at: datetime('created_at', { fsp: 3 }).default(now3),
  expires_at: datetime('expires_at', { fsp: 3 })
})
