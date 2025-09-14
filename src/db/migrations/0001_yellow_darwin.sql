ALTER TABLE "User" RENAME TO "user";--> statement-breakpoint
ALTER TABLE "Notification" DROP CONSTRAINT "Notification_userId_fkey";
--> statement-breakpoint
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."user"("userId") ON DELETE no action ON UPDATE no action;