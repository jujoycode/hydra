ALTER TABLE "users" ADD COLUMN "user_sn" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "user_password_hash" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "user_status" varchar(20) DEFAULT 'active';--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_user_sn_unique" UNIQUE("user_sn");