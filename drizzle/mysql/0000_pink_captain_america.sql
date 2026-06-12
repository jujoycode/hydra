CREATE TABLE `comments` (
	`comment_id` char(36) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
	`issue_id` char(36) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
	`comment_content` text NOT NULL,
	`comment_created_by` char(36) CHARACTER SET ascii COLLATE ascii_bin,
	`comment_updated_by` char(36) CHARACTER SET ascii COLLATE ascii_bin,
	`comment_created_at` datetime(3) DEFAULT CURRENT_TIMESTAMP(3),
	`comment_updated_at` datetime(3) DEFAULT CURRENT_TIMESTAMP(3),
	CONSTRAINT `comments_comment_id` PRIMARY KEY(`comment_id`)
) DEFAULT CHARSET=utf8mb4;
--> statement-breakpoint
CREATE TABLE `files` (
	`file_id` char(36) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
	`file_name` text NOT NULL,
	`file_path` text NOT NULL,
	`file_type` text NOT NULL,
	`file_size` int,
	`file_created_at` datetime(3) DEFAULT CURRENT_TIMESTAMP(3),
	`file_updated_at` datetime(3) DEFAULT CURRENT_TIMESTAMP(3),
	CONSTRAINT `files_file_id` PRIMARY KEY(`file_id`)
) DEFAULT CHARSET=utf8mb4;
--> statement-breakpoint
CREATE TABLE `integrations` (
	`integration_id` char(36) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
	`integration_type` varchar(50) NOT NULL,
	`integration_config` text NOT NULL,
	`integration_enabled` boolean DEFAULT false,
	`integration_created_at` datetime(3) DEFAULT CURRENT_TIMESTAMP(3),
	`integration_updated_at` datetime(3) DEFAULT CURRENT_TIMESTAMP(3),
	CONSTRAINT `integrations_integration_id` PRIMARY KEY(`integration_id`)
) DEFAULT CHARSET=utf8mb4;
--> statement-breakpoint
CREATE TABLE `invite_codes` (
	`invite_code_id` char(36) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
	`code` text NOT NULL,
	`workspace_name` text NOT NULL,
	`host` text NOT NULL,
	`port` int NOT NULL,
	`db_name` text NOT NULL,
	`created_by` text,
	`created_at` datetime(3) DEFAULT CURRENT_TIMESTAMP(3),
	`expires_at` datetime(3),
	CONSTRAINT `invite_codes_invite_code_id` PRIMARY KEY(`invite_code_id`)
) DEFAULT CHARSET=utf8mb4;
--> statement-breakpoint
CREATE TABLE `issue_relations` (
	`relation_id` char(36) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
	`source_issue_id` char(36) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
	`target_issue_id` char(36) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
	`relation_type` varchar(50) NOT NULL,
	`relation_created_at` datetime(3) DEFAULT CURRENT_TIMESTAMP(3),
	CONSTRAINT `issue_relations_relation_id` PRIMARY KEY(`relation_id`)
) DEFAULT CHARSET=utf8mb4;
--> statement-breakpoint
CREATE TABLE `issues` (
	`issue_id` char(36) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
	`project_id` char(36) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
	`issue_title` text NOT NULL,
	`issue_key` text NOT NULL,
	`issue_desc` text,
	`issue_status` varchar(50),
	`issue_priority` varchar(50),
	`issue_category` varchar(100),
	`issue_created_by` char(36) CHARACTER SET ascii COLLATE ascii_bin,
	`issue_modified_by` char(36) CHARACTER SET ascii COLLATE ascii_bin,
	`issue_assigned_to` char(36) CHARACTER SET ascii COLLATE ascii_bin,
	`issue_milestone_id` char(36) CHARACTER SET ascii COLLATE ascii_bin,
	`issue_created_at` datetime(3) DEFAULT CURRENT_TIMESTAMP(3),
	`issue_updated_at` datetime(3) DEFAULT CURRENT_TIMESTAMP(3),
	CONSTRAINT `issues_issue_id` PRIMARY KEY(`issue_id`)
) DEFAULT CHARSET=utf8mb4;
--> statement-breakpoint
CREATE TABLE `issues_files_link` (
	`issue_file_link_id` char(36) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
	`issue_id` char(36) CHARACTER SET ascii COLLATE ascii_bin,
	`file_id` char(36) CHARACTER SET ascii COLLATE ascii_bin,
	CONSTRAINT `issues_files_link_issue_file_link_id` PRIMARY KEY(`issue_file_link_id`)
) DEFAULT CHARSET=utf8mb4;
--> statement-breakpoint
CREATE TABLE `issues_labels_link` (
	`issue_label_link_id` char(36) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
	`issue_id` char(36) CHARACTER SET ascii COLLATE ascii_bin,
	`label_id` char(36) CHARACTER SET ascii COLLATE ascii_bin,
	CONSTRAINT `issues_labels_link_issue_label_link_id` PRIMARY KEY(`issue_label_link_id`)
) DEFAULT CHARSET=utf8mb4;
--> statement-breakpoint
CREATE TABLE `labels` (
	`label_id` char(36) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
	`label_name` varchar(100) NOT NULL,
	`label_color` varchar(7) NOT NULL,
	`label_created_at` datetime(3) DEFAULT CURRENT_TIMESTAMP(3),
	CONSTRAINT `labels_label_id` PRIMARY KEY(`label_id`)
) DEFAULT CHARSET=utf8mb4;
--> statement-breakpoint
CREATE TABLE `milestones` (
	`milestone_id` char(36) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
	`project_id` char(36) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
	`milestone_title` text NOT NULL,
	`milestone_desc` text,
	`milestone_due_date` datetime(3),
	`milestone_status` varchar(50) DEFAULT 'open',
	`milestone_created_at` datetime(3) DEFAULT CURRENT_TIMESTAMP(3),
	`milestone_updated_at` datetime(3) DEFAULT CURRENT_TIMESTAMP(3),
	CONSTRAINT `milestones_milestone_id` PRIMARY KEY(`milestone_id`)
) DEFAULT CHARSET=utf8mb4;
--> statement-breakpoint
CREATE TABLE `notifications` (
	`notification_id` char(36) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
	`user_id` char(36) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
	`notification_type` varchar(50) NOT NULL,
	`notification_title` text NOT NULL,
	`notification_message` text,
	`notification_read` boolean DEFAULT false,
	`notification_link` text,
	`notification_created_at` datetime(3) DEFAULT CURRENT_TIMESTAMP(3),
	CONSTRAINT `notifications_notification_id` PRIMARY KEY(`notification_id`)
) DEFAULT CHARSET=utf8mb4;
--> statement-breakpoint
CREATE TABLE `projects` (
	`project_id` char(36) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
	`project_name` text NOT NULL,
	`project_key` varchar(50) NOT NULL,
	`project_desc` text,
	`project_created_by` char(36) CHARACTER SET ascii COLLATE ascii_bin,
	`project_modified_by` char(36) CHARACTER SET ascii COLLATE ascii_bin,
	`project_start_date` datetime(3),
	`project_end_date` datetime(3),
	CONSTRAINT `projects_project_id` PRIMARY KEY(`project_id`),
	CONSTRAINT `projects_project_key_unique` UNIQUE(`project_key`)
) DEFAULT CHARSET=utf8mb4;
--> statement-breakpoint
CREATE TABLE `tasks` (
	`task_id` char(36) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
	`issue_id` char(36) CHARACTER SET ascii COLLATE ascii_bin,
	`task_title` text NOT NULL,
	`task_completed` boolean DEFAULT false,
	`task_order` int DEFAULT 0,
	`task_created_by` char(36) CHARACTER SET ascii COLLATE ascii_bin,
	`task_created_at` datetime(3) DEFAULT CURRENT_TIMESTAMP(3),
	`task_updated_at` datetime(3) DEFAULT CURRENT_TIMESTAMP(3),
	CONSTRAINT `tasks_task_id` PRIMARY KEY(`task_id`)
) DEFAULT CHARSET=utf8mb4;
--> statement-breakpoint
CREATE TABLE `users` (
	`user_id` char(36) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
	`user_sn` varchar(255) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
	`user_password_hash` varchar(255) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
	`user_status` varchar(20) DEFAULT 'active',
	`user_name` varchar(255),
	`user_email` varchar(255),
	`user_db_role` varchar(255),
	`user_avatar_path` varchar(1024),
	`user_role` varchar(50) DEFAULT 'member',
	`user_created_at` datetime(3),
	`user_updated_at` datetime(3),
	CONSTRAINT `users_user_id` PRIMARY KEY(`user_id`),
	CONSTRAINT `users_user_sn_unique` UNIQUE(`user_sn`)
) DEFAULT CHARSET=utf8mb4;
--> statement-breakpoint
CREATE TABLE `users_projects_link` (
	`user_project_link_id` char(36) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
	`user_id` char(36) CHARACTER SET ascii COLLATE ascii_bin,
	`project_id` char(36) CHARACTER SET ascii COLLATE ascii_bin,
	CONSTRAINT `users_projects_link_user_project_link_id` PRIMARY KEY(`user_project_link_id`)
) DEFAULT CHARSET=utf8mb4;
--> statement-breakpoint
ALTER TABLE `comments` ADD CONSTRAINT `comments_issue_id_issues_issue_id_fk` FOREIGN KEY (`issue_id`) REFERENCES `issues`(`issue_id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `issue_relations` ADD CONSTRAINT `issue_relations_source_issue_id_issues_issue_id_fk` FOREIGN KEY (`source_issue_id`) REFERENCES `issues`(`issue_id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `issue_relations` ADD CONSTRAINT `issue_relations_target_issue_id_issues_issue_id_fk` FOREIGN KEY (`target_issue_id`) REFERENCES `issues`(`issue_id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `issues` ADD CONSTRAINT `issues_project_id_projects_project_id_fk` FOREIGN KEY (`project_id`) REFERENCES `projects`(`project_id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `issues` ADD CONSTRAINT `issues_issue_milestone_id_milestones_milestone_id_fk` FOREIGN KEY (`issue_milestone_id`) REFERENCES `milestones`(`milestone_id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `issues_files_link` ADD CONSTRAINT `issues_files_link_issue_id_issues_issue_id_fk` FOREIGN KEY (`issue_id`) REFERENCES `issues`(`issue_id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `issues_files_link` ADD CONSTRAINT `issues_files_link_file_id_files_file_id_fk` FOREIGN KEY (`file_id`) REFERENCES `files`(`file_id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `issues_labels_link` ADD CONSTRAINT `issues_labels_link_issue_id_issues_issue_id_fk` FOREIGN KEY (`issue_id`) REFERENCES `issues`(`issue_id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `issues_labels_link` ADD CONSTRAINT `issues_labels_link_label_id_labels_label_id_fk` FOREIGN KEY (`label_id`) REFERENCES `labels`(`label_id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `milestones` ADD CONSTRAINT `milestones_project_id_projects_project_id_fk` FOREIGN KEY (`project_id`) REFERENCES `projects`(`project_id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `notifications` ADD CONSTRAINT `notifications_user_id_users_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `tasks` ADD CONSTRAINT `tasks_issue_id_issues_issue_id_fk` FOREIGN KEY (`issue_id`) REFERENCES `issues`(`issue_id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `users_projects_link` ADD CONSTRAINT `users_projects_link_user_id_users_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `users_projects_link` ADD CONSTRAINT `users_projects_link_project_id_projects_project_id_fk` FOREIGN KEY (`project_id`) REFERENCES `projects`(`project_id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `idx_comments_issue_id` ON `comments` (`issue_id`);--> statement-breakpoint
CREATE INDEX `idx_issue_relations_source` ON `issue_relations` (`source_issue_id`);--> statement-breakpoint
CREATE INDEX `idx_issue_relations_target` ON `issue_relations` (`target_issue_id`);--> statement-breakpoint
CREATE INDEX `idx_issues_project_id` ON `issues` (`project_id`);--> statement-breakpoint
CREATE INDEX `idx_issues_assigned_to` ON `issues` (`issue_assigned_to`);--> statement-breakpoint
CREATE INDEX `idx_issues_milestone_id` ON `issues` (`issue_milestone_id`);--> statement-breakpoint
CREATE INDEX `idx_issues_files_link_issue` ON `issues_files_link` (`issue_id`);--> statement-breakpoint
CREATE INDEX `idx_issues_files_link_file` ON `issues_files_link` (`file_id`);--> statement-breakpoint
CREATE INDEX `idx_issues_labels_link_issue` ON `issues_labels_link` (`issue_id`);--> statement-breakpoint
CREATE INDEX `idx_issues_labels_link_label` ON `issues_labels_link` (`label_id`);--> statement-breakpoint
CREATE INDEX `idx_milestones_project_id` ON `milestones` (`project_id`);--> statement-breakpoint
CREATE INDEX `idx_notifications_user_id` ON `notifications` (`user_id`);--> statement-breakpoint
CREATE INDEX `idx_tasks_issue_id` ON `tasks` (`issue_id`);--> statement-breakpoint
CREATE INDEX `idx_users_projects_link_user` ON `users_projects_link` (`user_id`);--> statement-breakpoint
CREATE INDEX `idx_users_projects_link_project` ON `users_projects_link` (`project_id`);
