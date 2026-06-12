CREATE TABLE "comments" (
	"comment_id" uuid PRIMARY KEY NOT NULL,
	"issue_id" uuid NOT NULL,
	"comment_content" text NOT NULL,
	"comment_created_by" uuid,
	"comment_updated_by" uuid,
	"comment_created_at" timestamp DEFAULT now(),
	"comment_updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "files" (
	"file_id" uuid PRIMARY KEY NOT NULL,
	"file_name" text NOT NULL,
	"file_path" text NOT NULL,
	"file_type" text NOT NULL,
	"file_size" integer,
	"file_created_at" timestamp DEFAULT now(),
	"file_updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "integrations" (
	"integration_id" uuid PRIMARY KEY NOT NULL,
	"integration_type" varchar(50) NOT NULL,
	"integration_config" text NOT NULL,
	"integration_enabled" boolean DEFAULT false,
	"integration_created_at" timestamp DEFAULT now(),
	"integration_updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "invite_codes" (
	"invite_code_id" uuid PRIMARY KEY NOT NULL,
	"code" text NOT NULL,
	"workspace_name" text NOT NULL,
	"host" text NOT NULL,
	"port" integer NOT NULL,
	"db_name" text NOT NULL,
	"created_by" text,
	"created_at" timestamp DEFAULT now(),
	"expires_at" timestamp,
	CONSTRAINT "invite_codes_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "issue_relations" (
	"relation_id" uuid PRIMARY KEY NOT NULL,
	"source_issue_id" uuid NOT NULL,
	"target_issue_id" uuid NOT NULL,
	"relation_type" varchar(50) NOT NULL,
	"relation_created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "issues" (
	"issue_id" uuid PRIMARY KEY NOT NULL,
	"project_id" uuid NOT NULL,
	"issue_title" text NOT NULL,
	"issue_key" text NOT NULL,
	"issue_desc" text,
	"issue_status" varchar(50),
	"issue_priority" varchar(50),
	"issue_category" varchar(100),
	"issue_created_by" uuid,
	"issue_modified_by" uuid,
	"issue_assigned_to" uuid,
	"issue_milestone_id" uuid,
	"issue_created_at" timestamp DEFAULT now(),
	"issue_updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "issues_files_link" (
	"issue_file_link_id" uuid PRIMARY KEY NOT NULL,
	"issue_id" uuid,
	"file_id" uuid
);
--> statement-breakpoint
CREATE TABLE "issues_labels_link" (
	"issue_label_link_id" uuid PRIMARY KEY NOT NULL,
	"issue_id" uuid,
	"label_id" uuid
);
--> statement-breakpoint
CREATE TABLE "labels" (
	"label_id" uuid PRIMARY KEY NOT NULL,
	"label_name" varchar(100) NOT NULL,
	"label_color" varchar(7) NOT NULL,
	"label_created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "milestones" (
	"milestone_id" uuid PRIMARY KEY NOT NULL,
	"project_id" uuid NOT NULL,
	"milestone_title" text NOT NULL,
	"milestone_desc" text,
	"milestone_due_date" timestamp,
	"milestone_status" varchar(50) DEFAULT 'open',
	"milestone_created_at" timestamp DEFAULT now(),
	"milestone_updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "notifications" (
	"notification_id" uuid PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"notification_type" varchar(50) NOT NULL,
	"notification_title" text NOT NULL,
	"notification_message" text,
	"notification_read" boolean DEFAULT false,
	"notification_link" text,
	"notification_created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "projects" (
	"project_id" uuid PRIMARY KEY NOT NULL,
	"project_name" text NOT NULL,
	"project_key" text NOT NULL,
	"project_desc" text,
	"project_created_by" uuid,
	"project_modified_by" uuid,
	"project_start_date" timestamp,
	"project_end_date" timestamp,
	CONSTRAINT "projects_project_key_unique" UNIQUE("project_key")
);
--> statement-breakpoint
CREATE TABLE "tasks" (
	"task_id" uuid PRIMARY KEY NOT NULL,
	"issue_id" uuid,
	"task_title" text NOT NULL,
	"task_completed" boolean DEFAULT false,
	"task_order" integer DEFAULT 0,
	"task_created_by" uuid,
	"task_created_at" timestamp DEFAULT now(),
	"task_updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "users" (
	"user_id" uuid PRIMARY KEY NOT NULL,
	"user_name" varchar(255),
	"user_email" varchar(255),
	"user_db_role" varchar(255),
	"user_avatar_path" varchar(1024),
	"user_role" varchar(50) DEFAULT 'member',
	"user_created_at" timestamp,
	"user_updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "users_projects_link" (
	"user_project_link_id" uuid PRIMARY KEY NOT NULL,
	"user_id" uuid,
	"project_id" uuid
);
--> statement-breakpoint
ALTER TABLE "comments" ADD CONSTRAINT "comments_issue_id_issues_issue_id_fk" FOREIGN KEY ("issue_id") REFERENCES "public"."issues"("issue_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "issue_relations" ADD CONSTRAINT "issue_relations_source_issue_id_issues_issue_id_fk" FOREIGN KEY ("source_issue_id") REFERENCES "public"."issues"("issue_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "issue_relations" ADD CONSTRAINT "issue_relations_target_issue_id_issues_issue_id_fk" FOREIGN KEY ("target_issue_id") REFERENCES "public"."issues"("issue_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "issues" ADD CONSTRAINT "issues_project_id_projects_project_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("project_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "issues" ADD CONSTRAINT "issues_issue_milestone_id_milestones_milestone_id_fk" FOREIGN KEY ("issue_milestone_id") REFERENCES "public"."milestones"("milestone_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "issues_files_link" ADD CONSTRAINT "issues_files_link_issue_id_issues_issue_id_fk" FOREIGN KEY ("issue_id") REFERENCES "public"."issues"("issue_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "issues_files_link" ADD CONSTRAINT "issues_files_link_file_id_files_file_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."files"("file_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "issues_labels_link" ADD CONSTRAINT "issues_labels_link_issue_id_issues_issue_id_fk" FOREIGN KEY ("issue_id") REFERENCES "public"."issues"("issue_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "issues_labels_link" ADD CONSTRAINT "issues_labels_link_label_id_labels_label_id_fk" FOREIGN KEY ("label_id") REFERENCES "public"."labels"("label_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "milestones" ADD CONSTRAINT "milestones_project_id_projects_project_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("project_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_user_id_users_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_issue_id_issues_issue_id_fk" FOREIGN KEY ("issue_id") REFERENCES "public"."issues"("issue_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users_projects_link" ADD CONSTRAINT "users_projects_link_user_id_users_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users_projects_link" ADD CONSTRAINT "users_projects_link_project_id_projects_project_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("project_id") ON DELETE no action ON UPDATE no action;