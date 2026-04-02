// Drizzle ORM 스키마 정의 - PostgreSQL

import { boolean, integer, pgTable, text, timestamp, uuid, varchar } from 'drizzle-orm/pg-core'

// 사용자 테이블
export const users = pgTable('users', {
  user_id: uuid('user_id').primaryKey(),
  user_name: varchar('user_name', { length: 255 }),
  user_email: varchar('user_email', { length: 255 }),
  user_db_role: varchar('user_db_role', { length: 255 }),
  user_avatar_path: varchar('user_avatar_path', { length: 1024 }),
  user_role: varchar('user_role', { length: 50 }).default('member'),
  user_created_at: timestamp('user_created_at'),
  user_updated_at: timestamp('user_updated_at')
})

// 프로젝트 테이블
export const projects = pgTable('projects', {
  project_id: uuid('project_id').primaryKey(),
  project_name: text('project_name').notNull(),
  project_key: text('project_key').notNull().unique(),
  project_desc: text('project_desc'),
  project_created_by: uuid('project_created_by'),
  project_modified_by: uuid('project_modified_by'),
  project_start_date: timestamp('project_start_date'),
  project_end_date: timestamp('project_end_date')
})

// 사용자-프로젝트 연결 테이블
export const usersProjectsLink = pgTable('users_projects_link', {
  user_project_link_id: uuid('user_project_link_id').primaryKey(),
  user_id: uuid('user_id').references(() => users.user_id),
  project_id: uuid('project_id').references(() => projects.project_id)
})

// 이슈 테이블
export const issues = pgTable('issues', {
  issue_id: uuid('issue_id').primaryKey(),
  project_id: uuid('project_id')
    .notNull()
    .references(() => projects.project_id),
  issue_title: text('issue_title').notNull(),
  issue_key: text('issue_key').notNull(),
  issue_desc: text('issue_desc'),
  issue_status: varchar('issue_status', { length: 50 }),
  issue_priority: varchar('issue_priority', { length: 50 }),
  issue_category: varchar('issue_category', { length: 100 }),
  issue_created_by: uuid('issue_created_by'),
  issue_modified_by: uuid('issue_modified_by'),
  issue_assigned_to: uuid('issue_assigned_to'),
  issue_created_at: timestamp('issue_created_at').defaultNow(),
  issue_updated_at: timestamp('issue_updated_at').defaultNow()
})

// 파일 테이블
export const files = pgTable('files', {
  file_id: uuid('file_id').primaryKey(),
  file_name: text('file_name').notNull(),
  file_path: text('file_path').notNull(),
  file_type: text('file_type').notNull(),
  file_size: integer('file_size'),
  file_created_at: timestamp('file_created_at').defaultNow(),
  file_updated_at: timestamp('file_updated_at').defaultNow()
})

// 이슈-파일 연결 테이블
export const issuesFilesLink = pgTable('issues_files_link', {
  issue_file_link_id: uuid('issue_file_link_id').primaryKey(),
  issue_id: uuid('issue_id').references(() => issues.issue_id),
  file_id: uuid('file_id').references(() => files.file_id)
})

// 댓글 테이블
export const comments = pgTable('comments', {
  comment_id: uuid('comment_id').primaryKey(),
  issue_id: uuid('issue_id')
    .notNull()
    .references(() => issues.issue_id),
  comment_content: text('comment_content').notNull(),
  comment_created_by: uuid('comment_created_by'),
  comment_updated_by: uuid('comment_updated_by'),
  comment_created_at: timestamp('comment_created_at').defaultNow(),
  comment_updated_at: timestamp('comment_updated_at').defaultNow()
})

// 라벨 테이블
export const labels = pgTable('labels', {
  label_id: uuid('label_id').primaryKey(),
  label_name: varchar('label_name', { length: 100 }).notNull(),
  label_color: varchar('label_color', { length: 7 }).notNull(),
  label_created_at: timestamp('label_created_at').defaultNow()
})

// 이슈-라벨 연결 테이블
export const issuesLabelsLink = pgTable('issues_labels_link', {
  issue_label_link_id: uuid('issue_label_link_id').primaryKey(),
  issue_id: uuid('issue_id').references(() => issues.issue_id),
  label_id: uuid('label_id').references(() => labels.label_id)
})

// 태스크 테이블
export const tasks = pgTable('tasks', {
  task_id: uuid('task_id').primaryKey(),
  issue_id: uuid('issue_id').references(() => issues.issue_id),
  task_title: text('task_title').notNull(),
  task_completed: boolean('task_completed').default(false),
  task_order: integer('task_order').default(0),
  task_created_by: uuid('task_created_by'),
  task_created_at: timestamp('task_created_at').defaultNow(),
  task_updated_at: timestamp('task_updated_at').defaultNow()
})

// 초대 코드 테이블
export const inviteCodes = pgTable('invite_codes', {
  invite_code_id: uuid('invite_code_id').primaryKey(),
  code: text('code').notNull().unique(),
  workspace_name: text('workspace_name').notNull(),
  host: text('host').notNull(),
  port: integer('port').notNull(),
  db_name: text('db_name').notNull(),
  created_by: text('created_by'),
  created_at: timestamp('created_at').defaultNow(),
  expires_at: timestamp('expires_at')
})
