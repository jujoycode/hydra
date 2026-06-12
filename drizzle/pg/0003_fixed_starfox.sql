ALTER TABLE "comments" ALTER COLUMN "comment_created_at" SET DATA TYPE timestamp (3);--> statement-breakpoint
ALTER TABLE "comments" ALTER COLUMN "comment_created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "comments" ALTER COLUMN "comment_updated_at" SET DATA TYPE timestamp (3);--> statement-breakpoint
ALTER TABLE "comments" ALTER COLUMN "comment_updated_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "files" ALTER COLUMN "file_created_at" SET DATA TYPE timestamp (3);--> statement-breakpoint
ALTER TABLE "files" ALTER COLUMN "file_created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "files" ALTER COLUMN "file_updated_at" SET DATA TYPE timestamp (3);--> statement-breakpoint
ALTER TABLE "files" ALTER COLUMN "file_updated_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "integrations" ALTER COLUMN "integration_created_at" SET DATA TYPE timestamp (3);--> statement-breakpoint
ALTER TABLE "integrations" ALTER COLUMN "integration_created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "integrations" ALTER COLUMN "integration_updated_at" SET DATA TYPE timestamp (3);--> statement-breakpoint
ALTER TABLE "integrations" ALTER COLUMN "integration_updated_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "invite_codes" ALTER COLUMN "created_at" SET DATA TYPE timestamp (3);--> statement-breakpoint
ALTER TABLE "invite_codes" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "invite_codes" ALTER COLUMN "expires_at" SET DATA TYPE timestamp (3);--> statement-breakpoint
ALTER TABLE "issue_relations" ALTER COLUMN "relation_created_at" SET DATA TYPE timestamp (3);--> statement-breakpoint
ALTER TABLE "issue_relations" ALTER COLUMN "relation_created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "issues" ALTER COLUMN "issue_created_at" SET DATA TYPE timestamp (3);--> statement-breakpoint
ALTER TABLE "issues" ALTER COLUMN "issue_created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "issues" ALTER COLUMN "issue_updated_at" SET DATA TYPE timestamp (3);--> statement-breakpoint
ALTER TABLE "issues" ALTER COLUMN "issue_updated_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "labels" ALTER COLUMN "label_created_at" SET DATA TYPE timestamp (3);--> statement-breakpoint
ALTER TABLE "labels" ALTER COLUMN "label_created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "milestones" ALTER COLUMN "milestone_due_date" SET DATA TYPE timestamp (3);--> statement-breakpoint
ALTER TABLE "milestones" ALTER COLUMN "milestone_created_at" SET DATA TYPE timestamp (3);--> statement-breakpoint
ALTER TABLE "milestones" ALTER COLUMN "milestone_created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "milestones" ALTER COLUMN "milestone_updated_at" SET DATA TYPE timestamp (3);--> statement-breakpoint
ALTER TABLE "milestones" ALTER COLUMN "milestone_updated_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "notifications" ALTER COLUMN "notification_created_at" SET DATA TYPE timestamp (3);--> statement-breakpoint
ALTER TABLE "notifications" ALTER COLUMN "notification_created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "projects" ALTER COLUMN "project_start_date" SET DATA TYPE timestamp (3);--> statement-breakpoint
ALTER TABLE "projects" ALTER COLUMN "project_end_date" SET DATA TYPE timestamp (3);--> statement-breakpoint
ALTER TABLE "tasks" ALTER COLUMN "task_created_at" SET DATA TYPE timestamp (3);--> statement-breakpoint
ALTER TABLE "tasks" ALTER COLUMN "task_created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "tasks" ALTER COLUMN "task_updated_at" SET DATA TYPE timestamp (3);--> statement-breakpoint
ALTER TABLE "tasks" ALTER COLUMN "task_updated_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "user_created_at" SET DATA TYPE timestamp (3);--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "user_updated_at" SET DATA TYPE timestamp (3);