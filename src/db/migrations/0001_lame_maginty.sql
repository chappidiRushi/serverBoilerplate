ALTER TABLE "plant_category" ALTER COLUMN "createdAt" SET DATA TYPE timestamp (3) with time zone;--> statement-breakpoint
ALTER TABLE "plant_category" ALTER COLUMN "createdAt" SET DEFAULT CURRENT_TIMESTAMP;--> statement-breakpoint
ALTER TABLE "plant_category" ALTER COLUMN "updatedAt" SET DATA TYPE timestamp (3) with time zone;--> statement-breakpoint
ALTER TABLE "plant_category" ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP;--> statement-breakpoint
ALTER TABLE "plant_category" ALTER COLUMN "deletedAt" SET DATA TYPE timestamp (3) with time zone;