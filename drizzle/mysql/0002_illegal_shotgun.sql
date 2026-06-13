CREATE TABLE `activity_logs` (
	`activity_id` char(36) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
	`activity_entity_type` varchar(50) NOT NULL,
	`activity_entity_id` char(36) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
	`activity_action` varchar(50) NOT NULL,
	`activity_actor_id` char(36) CHARACTER SET ascii COLLATE ascii_bin,
	`activity_metadata` text,
	`activity_created_at` datetime(3) DEFAULT CURRENT_TIMESTAMP(3),
	CONSTRAINT `activity_logs_activity_id` PRIMARY KEY(`activity_id`)
);
--> statement-breakpoint
ALTER TABLE `activity_logs` ADD CONSTRAINT `activity_logs_activity_actor_id_users_user_id_fk` FOREIGN KEY (`activity_actor_id`) REFERENCES `users`(`user_id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `idx_activity_logs_entity` ON `activity_logs` (`activity_entity_type`,`activity_entity_id`);