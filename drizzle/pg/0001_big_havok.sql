CREATE INDEX "idx_comments_issue_id" ON "comments" USING btree ("issue_id");--> statement-breakpoint
CREATE INDEX "idx_issue_relations_source" ON "issue_relations" USING btree ("source_issue_id");--> statement-breakpoint
CREATE INDEX "idx_issue_relations_target" ON "issue_relations" USING btree ("target_issue_id");--> statement-breakpoint
CREATE INDEX "idx_issues_project_id" ON "issues" USING btree ("project_id");--> statement-breakpoint
CREATE INDEX "idx_issues_assigned_to" ON "issues" USING btree ("issue_assigned_to");--> statement-breakpoint
CREATE INDEX "idx_issues_milestone_id" ON "issues" USING btree ("issue_milestone_id");--> statement-breakpoint
CREATE INDEX "idx_issues_files_link_issue" ON "issues_files_link" USING btree ("issue_id");--> statement-breakpoint
CREATE INDEX "idx_issues_files_link_file" ON "issues_files_link" USING btree ("file_id");--> statement-breakpoint
CREATE INDEX "idx_issues_labels_link_issue" ON "issues_labels_link" USING btree ("issue_id");--> statement-breakpoint
CREATE INDEX "idx_issues_labels_link_label" ON "issues_labels_link" USING btree ("label_id");--> statement-breakpoint
CREATE INDEX "idx_milestones_project_id" ON "milestones" USING btree ("project_id");--> statement-breakpoint
CREATE INDEX "idx_notifications_user_id" ON "notifications" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_tasks_issue_id" ON "tasks" USING btree ("issue_id");--> statement-breakpoint
CREATE INDEX "idx_users_projects_link_user" ON "users_projects_link" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_users_projects_link_project" ON "users_projects_link" USING btree ("project_id");