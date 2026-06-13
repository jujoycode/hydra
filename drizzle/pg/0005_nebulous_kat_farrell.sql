CREATE TABLE "activity_logs" (
	"activity_id" uuid PRIMARY KEY NOT NULL,
	"activity_entity_type" varchar(50) NOT NULL,
	"activity_entity_id" uuid NOT NULL,
	"activity_action" varchar(50) NOT NULL,
	"activity_actor_id" uuid,
	"activity_metadata" text,
	"activity_created_at" timestamp (3) DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "activity_logs" ADD CONSTRAINT "activity_logs_activity_actor_id_users_user_id_fk" FOREIGN KEY ("activity_actor_id") REFERENCES "public"."users"("user_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_activity_logs_entity" ON "activity_logs" USING btree ("activity_entity_type","activity_entity_id");