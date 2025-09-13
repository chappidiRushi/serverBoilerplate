CREATE TYPE "public"."AddedByType" AS ENUM('SYSTEM', 'ADMIN', 'SUPERADMIN');--> statement-breakpoint
CREATE TYPE "public"."AuditAction" AS ENUM('ADDED', 'REVOKED', 'MODIFIED');--> statement-breakpoint
CREATE TYPE "public"."DamageType" AS ENUM('USER_DELIVERY', 'SUPPLIER_DELIVERY', 'WAREHOUSE_IN_HOUSE');--> statement-breakpoint
CREATE TYPE "public"."NotificationCategory" AS ENUM('GENERAL', 'ORDER', 'PROMOTION', 'ALERT', 'REMINDER', 'SYSTEM', 'SECURITY');--> statement-breakpoint
CREATE TYPE "public"."OrderStatus" AS ENUM('APPROVED', 'PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'RETURNED', 'PROCESSING', 'REJECTED', 'UNDER_REVIEW');--> statement-breakpoint
CREATE TYPE "public"."PaymentMethod" AS ENUM('CASH', 'ONLINE', 'UPI', 'NEFT', 'BANK_TRANSFER');--> statement-breakpoint
CREATE TYPE "public"."Size" AS ENUM('EXTRA_SMALL', 'SMALL', 'MEDIUM', 'LARGE', 'EXTRA_LARGE');--> statement-breakpoint
CREATE TABLE "Color" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"hexCode" text DEFAULT '#FFFFFF' NOT NULL,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) NOT NULL,
	"deletedAt" timestamp(3)
);
--> statement-breakpoint
CREATE TABLE "_CompatiblePots" (
	"A" text NOT NULL,
	"B" text NOT NULL,
	CONSTRAINT "_CompatiblePots_AB_pkey" PRIMARY KEY("A","B")
);
--> statement-breakpoint
CREATE TABLE "Fertilizers" (
	"fertilizerId" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"type" text NOT NULL,
	"composition" text NOT NULL,
	"description" text,
	"caution" text,
	"isEcoFriendly" boolean NOT NULL,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) NOT NULL,
	"deletedAt" timestamp(3)
);
--> statement-breakpoint
CREATE TABLE "HumidityLevel" (
	"humidityId" text PRIMARY KEY NOT NULL,
	"level" text NOT NULL,
	"description" text,
	"suitableZones" text,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) NOT NULL,
	"deletedAt" timestamp(3)
);
--> statement-breakpoint
CREATE TABLE "Notification" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"title" text NOT NULL,
	"body" text NOT NULL,
	"category" "NotificationCategory" DEFAULT 'GENERAL' NOT NULL,
	"isRead" boolean DEFAULT false NOT NULL,
	"actionUrl" text,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "PlantCareGuidelines" (
	"plantCareId" text PRIMARY KEY NOT NULL,
	"plantSizeId" text NOT NULL,
	"sunlightTypeId" text NOT NULL,
	"humidityLevelId" text NOT NULL,
	"season" text NOT NULL,
	"wateringFrequency" text NOT NULL,
	"waterAmountMl" numeric(65, 30) NOT NULL,
	"wateringMethod" text NOT NULL,
	"recommendedTime" text NOT NULL,
	"soilTypes" text NOT NULL,
	"preferredSeasons" text NOT NULL,
	"careNotes" text,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) NOT NULL,
	"deletedAt" timestamp(3)
);
--> statement-breakpoint
CREATE TABLE "PlantCategory" (
	"categoryId" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text NOT NULL,
	"publicId" text NOT NULL,
	"mediaUrl" text,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) NOT NULL,
	"deletedAt" timestamp(3)
);
--> statement-breakpoint
CREATE TABLE "PlantFertilizerSchedule" (
	"fertilizerScheduleId" text PRIMARY KEY NOT NULL,
	"plantSizeId" text NOT NULL,
	"fertilizerId" text NOT NULL,
	"applicationFrequency" text NOT NULL,
	"applicationMethod" text[] DEFAULT '{"RAY"}',
	"applicationSeason" text NOT NULL,
	"applicationTime" text NOT NULL,
	"benefits" text[] DEFAULT '{"RAY"}',
	"dosageAmount" numeric(65, 30) NOT NULL,
	"safetyNotes" text[] DEFAULT '{"RAY"}',
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) NOT NULL,
	"deletedAt" timestamp(3)
);
--> statement-breakpoint
CREATE TABLE "PlantSizeProfile" (
	"plantSizeId" text PRIMARY KEY NOT NULL,
	"plantId" text NOT NULL,
	"plantSize" text NOT NULL,
	"height" numeric(65, 30) NOT NULL,
	"weight" numeric(65, 30) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "PlantVariantImage" (
	"id" text PRIMARY KEY NOT NULL,
	"plantVariantId" text NOT NULL,
	"mediaUrl" text NOT NULL,
	"publicId" text NOT NULL,
	"mediaType" text,
	"resourceType" text,
	"isPrimary" boolean DEFAULT false NOT NULL,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) NOT NULL,
	"deletedAt" timestamp(3)
);
--> statement-breakpoint
CREATE TABLE "_PlantVariantToTags" (
	"A" text NOT NULL,
	"B" text NOT NULL,
	CONSTRAINT "_PlantVariantToTags_AB_pkey" PRIMARY KEY("A","B")
);
--> statement-breakpoint
CREATE TABLE "PlantVariants" (
	"variantId" text PRIMARY KEY NOT NULL,
	"plantId" text NOT NULL,
	"plantSizeId" text NOT NULL,
	"colorId" text NOT NULL,
	"sku" text NOT NULL,
	"isProductActive" boolean DEFAULT true NOT NULL,
	"mrp" numeric(65, 30) DEFAULT '0.0' NOT NULL,
	"notes" text,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) NOT NULL,
	"deletedAt" timestamp(3)
);
--> statement-breakpoint
CREATE TABLE "Plants" (
	"plantId" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"scientificName" text,
	"description" text NOT NULL,
	"isProductActive" boolean DEFAULT true NOT NULL,
	"isFeatured" boolean NOT NULL,
	"plantClass" text,
	"plantSeries" text,
	"placeOfOrigin" text,
	"auraType" text,
	"biodiversityBooster" boolean,
	"carbonAbsorber" boolean,
	"minimumTemperature" integer,
	"maximumTemperature" integer,
	"soil" text,
	"repotting" text,
	"maintenance" text,
	"insideBox" text[] DEFAULT '{"RAY"}',
	"benefits" text[] DEFAULT '{"RAY"}',
	"spiritualUseCase" text[] DEFAULT '{"RAY"}',
	"bestForEmotion" text[] DEFAULT '{"RAY"}',
	"bestGiftFor" text[] DEFAULT '{"RAY"}',
	"funFacts" text[] DEFAULT '{"RAY"}',
	"associatedDeity" text[] DEFAULT '{"RAY"}',
	"godAligned" text[] DEFAULT '{"RAY"}',
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) NOT NULL,
	"deletedAt" timestamp(3)
);
--> statement-breakpoint
CREATE TABLE "PotCategory" (
	"categoryId" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"publicId" text,
	"mediaUrl" text,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) NOT NULL,
	"deletedAt" timestamp(3)
);
--> statement-breakpoint
CREATE TABLE "PotMaterial" (
	"materialId" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text NOT NULL,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) NOT NULL,
	"deletedAt" timestamp(3)
);
--> statement-breakpoint
CREATE TABLE "PotSizeProfile" (
	"potSizeProfileId" text PRIMARY KEY NOT NULL,
	"categoryId" text NOT NULL,
	"size" text NOT NULL,
	"height" numeric(65, 30),
	"weight" numeric(65, 30)
);
--> statement-breakpoint
CREATE TABLE "PotVariantImage" (
	"id" text PRIMARY KEY NOT NULL,
	"potVariantId" text NOT NULL,
	"publicId" text NOT NULL,
	"mediaUrl" text NOT NULL,
	"mediaType" text,
	"resourceType" text,
	"isPrimary" boolean DEFAULT false NOT NULL,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) NOT NULL,
	"deletedAt" timestamp(3)
);
--> statement-breakpoint
CREATE TABLE "_PotVariantToTags" (
	"A" text NOT NULL,
	"B" text NOT NULL,
	CONSTRAINT "_PotVariantToTags_AB_pkey" PRIMARY KEY("A","B")
);
--> statement-breakpoint
CREATE TABLE "PotVariants" (
	"potVariantId" text PRIMARY KEY NOT NULL,
	"colorId" text NOT NULL,
	"potName" text NOT NULL,
	"sku" text NOT NULL,
	"mrp" numeric(65, 30) DEFAULT '0.0' NOT NULL,
	"isEcoFriendly" boolean DEFAULT false NOT NULL,
	"isPremium" boolean DEFAULT false NOT NULL,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) NOT NULL,
	"deletedAt" timestamp(3),
	"sizeMaterialOptionId" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "_prisma_migrations" (
	"id" varchar(36) PRIMARY KEY NOT NULL,
	"checksum" varchar(64) NOT NULL,
	"finished_at" timestamp with time zone,
	"migration_name" varchar(255) NOT NULL,
	"logs" text,
	"rolled_back_at" timestamp with time zone,
	"started_at" timestamp with time zone DEFAULT now() NOT NULL,
	"applied_steps_count" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "_ProductCategories" (
	"A" text NOT NULL,
	"B" text NOT NULL,
	CONSTRAINT "_ProductCategories_AB_pkey" PRIMARY KEY("A","B")
);
--> statement-breakpoint
CREATE TABLE "SerialTracker" (
	"id" serial PRIMARY KEY NOT NULL,
	"entityCode" text NOT NULL,
	"year" integer NOT NULL,
	"lastSerial" integer DEFAULT 0 NOT NULL,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "SizeMaterialOption" (
	"sizeMaterialOptionId" text PRIMARY KEY NOT NULL,
	"potSizeProfileId" text NOT NULL,
	"materialId" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "SunlightTypes" (
	"sunlightId" text PRIMARY KEY NOT NULL,
	"typeName" text NOT NULL,
	"mediaUrl" text NOT NULL,
	"publicId" text NOT NULL,
	"description" text,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) NOT NULL,
	"deletedAt" timestamp(3)
);
--> statement-breakpoint
CREATE TABLE "TagGroups" (
	"groupId" text PRIMARY KEY NOT NULL,
	"groupName" text NOT NULL,
	"groupDescription" text,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) NOT NULL,
	"deletedAt" timestamp(3)
);
--> statement-breakpoint
CREATE TABLE "Tags" (
	"tagId" text PRIMARY KEY NOT NULL,
	"groupId" text NOT NULL,
	"tagName" text NOT NULL,
	"tagDesc" text NOT NULL,
	"tagIcon" text,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) NOT NULL,
	"deletedAt" timestamp(3)
);
--> statement-breakpoint
CREATE TABLE "User" (
	"userId" text PRIMARY KEY NOT NULL,
	"fullName" jsonb NOT NULL,
	"phoneNumber" text,
	"email" text NOT NULL,
	"password" text NOT NULL,
	"isActive" boolean DEFAULT true NOT NULL,
	"profileImageUrl" text,
	"publicId" text,
	"phoneVerified" boolean DEFAULT false NOT NULL,
	"emailVerified" boolean DEFAULT false NOT NULL,
	"address" jsonb,
	"deactivationReason" text,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) NOT NULL,
	"deletedAt" timestamp(3)
);
--> statement-breakpoint
CREATE TABLE "Warehouse" (
	"warehouseId" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"capacityUnits" integer,
	"officeEmail" text,
	"officePhone" text,
	"officeAddress" jsonb,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) NOT NULL
);
--> statement-breakpoint
ALTER TABLE "_CompatiblePots" ADD CONSTRAINT "_CompatiblePots_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."PlantSizeProfile"("plantSizeId") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "_CompatiblePots" ADD CONSTRAINT "_CompatiblePots_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."PotVariants"("potVariantId") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("userId") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "PlantCareGuidelines" ADD CONSTRAINT "PlantCareGuidelines_plantSizeId_fkey" FOREIGN KEY ("plantSizeId") REFERENCES "public"."PlantSizeProfile"("plantSizeId") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "PlantCareGuidelines" ADD CONSTRAINT "PlantCareGuidelines_sunlightTypeId_fkey" FOREIGN KEY ("sunlightTypeId") REFERENCES "public"."SunlightTypes"("sunlightId") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "PlantCareGuidelines" ADD CONSTRAINT "PlantCareGuidelines_humidityLevelId_fkey" FOREIGN KEY ("humidityLevelId") REFERENCES "public"."HumidityLevel"("humidityId") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "PlantFertilizerSchedule" ADD CONSTRAINT "PlantFertilizerSchedule_plantSizeId_fkey" FOREIGN KEY ("plantSizeId") REFERENCES "public"."PlantSizeProfile"("plantSizeId") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "PlantFertilizerSchedule" ADD CONSTRAINT "PlantFertilizerSchedule_fertilizerId_fkey" FOREIGN KEY ("fertilizerId") REFERENCES "public"."Fertilizers"("fertilizerId") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "PlantSizeProfile" ADD CONSTRAINT "PlantSizeProfile_plantId_fkey" FOREIGN KEY ("plantId") REFERENCES "public"."Plants"("plantId") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "PlantVariantImage" ADD CONSTRAINT "PlantVariantImage_plantVariantId_fkey" FOREIGN KEY ("plantVariantId") REFERENCES "public"."PlantVariants"("variantId") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "_PlantVariantToTags" ADD CONSTRAINT "_PlantVariantToTags_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."PlantVariants"("variantId") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "_PlantVariantToTags" ADD CONSTRAINT "_PlantVariantToTags_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."Tags"("tagId") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "PlantVariants" ADD CONSTRAINT "PlantVariants_plantId_fkey" FOREIGN KEY ("plantId") REFERENCES "public"."Plants"("plantId") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "PlantVariants" ADD CONSTRAINT "PlantVariants_colorId_fkey" FOREIGN KEY ("colorId") REFERENCES "public"."Color"("id") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "PlantVariants" ADD CONSTRAINT "PlantVariants_plantSizeId_fkey" FOREIGN KEY ("plantSizeId") REFERENCES "public"."PlantSizeProfile"("plantSizeId") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "PotSizeProfile" ADD CONSTRAINT "PotSizeProfile_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "public"."PotCategory"("categoryId") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "PotVariantImage" ADD CONSTRAINT "PotVariantImage_potVariantId_fkey" FOREIGN KEY ("potVariantId") REFERENCES "public"."PotVariants"("potVariantId") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "_PotVariantToTags" ADD CONSTRAINT "_PotVariantToTags_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."PotVariants"("potVariantId") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "_PotVariantToTags" ADD CONSTRAINT "_PotVariantToTags_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."Tags"("tagId") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "PotVariants" ADD CONSTRAINT "PotVariants_colorId_fkey" FOREIGN KEY ("colorId") REFERENCES "public"."Color"("id") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "PotVariants" ADD CONSTRAINT "PotVariants_sizeMaterialOptionId_fkey" FOREIGN KEY ("sizeMaterialOptionId") REFERENCES "public"."SizeMaterialOption"("sizeMaterialOptionId") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "_ProductCategories" ADD CONSTRAINT "_ProductCategories_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."PlantCategory"("categoryId") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "_ProductCategories" ADD CONSTRAINT "_ProductCategories_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."Plants"("plantId") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "SizeMaterialOption" ADD CONSTRAINT "SizeMaterialOption_potSizeProfileId_fkey" FOREIGN KEY ("potSizeProfileId") REFERENCES "public"."PotSizeProfile"("potSizeProfileId") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "SizeMaterialOption" ADD CONSTRAINT "SizeMaterialOption_materialId_fkey" FOREIGN KEY ("materialId") REFERENCES "public"."PotMaterial"("materialId") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "Tags" ADD CONSTRAINT "Tags_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "public"."TagGroups"("groupId") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
CREATE UNIQUE INDEX "Color_name_key" ON "Color" USING btree ("name" text_ops);--> statement-breakpoint
CREATE INDEX "_CompatiblePots_B_index" ON "_CompatiblePots" USING btree ("B" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "PlantCareGuidelines_plantSizeId_season_key" ON "PlantCareGuidelines" USING btree ("plantSizeId" text_ops,"season" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "PlantFertilizerSchedule_plantSizeId_fertilizerId_applicatio_key" ON "PlantFertilizerSchedule" USING btree ("plantSizeId" text_ops,"fertilizerId" text_ops,"applicationSeason" text_ops);--> statement-breakpoint
CREATE INDEX "PlantVariantImage_plantVariantId_idx" ON "PlantVariantImage" USING btree ("plantVariantId" text_ops);--> statement-breakpoint
CREATE INDEX "_PlantVariantToTags_B_index" ON "_PlantVariantToTags" USING btree ("B" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "PlantVariants_sku_key" ON "PlantVariants" USING btree ("sku" text_ops);--> statement-breakpoint
CREATE INDEX "Plants_isFeatured_idx" ON "Plants" USING btree ("isFeatured" bool_ops);--> statement-breakpoint
CREATE INDEX "Plants_isProductActive_idx" ON "Plants" USING btree ("isProductActive" bool_ops);--> statement-breakpoint
CREATE INDEX "Plants_name_idx" ON "Plants" USING btree ("name" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "PotMaterial_name_key" ON "PotMaterial" USING btree ("name" text_ops);--> statement-breakpoint
CREATE INDEX "PotSizeProfile_categoryId_idx" ON "PotSizeProfile" USING btree ("categoryId" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "PotSizeProfile_categoryId_size_key" ON "PotSizeProfile" USING btree ("categoryId" text_ops,"size" text_ops);--> statement-breakpoint
CREATE INDEX "PotSizeProfile_size_idx" ON "PotSizeProfile" USING btree ("size" text_ops);--> statement-breakpoint
CREATE INDEX "PotVariantImage_potVariantId_idx" ON "PotVariantImage" USING btree ("potVariantId" text_ops);--> statement-breakpoint
CREATE INDEX "_PotVariantToTags_B_index" ON "_PotVariantToTags" USING btree ("B" text_ops);--> statement-breakpoint
CREATE INDEX "PotVariants_colorId_idx" ON "PotVariants" USING btree ("colorId" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "PotVariants_sizeMaterialOptionId_colorId_key" ON "PotVariants" USING btree ("sizeMaterialOptionId" text_ops,"colorId" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "PotVariants_sku_key" ON "PotVariants" USING btree ("sku" text_ops);--> statement-breakpoint
CREATE INDEX "_ProductCategories_B_index" ON "_ProductCategories" USING btree ("B" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "SizeMaterialOption_potSizeProfileId_materialId_key" ON "SizeMaterialOption" USING btree ("potSizeProfileId" text_ops,"materialId" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "User_email_key" ON "User" USING btree ("email" text_ops);--> statement-breakpoint
CREATE INDEX "User_phoneNumber_email_idx" ON "User" USING btree ("phoneNumber" text_ops,"email" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "User_phoneNumber_key" ON "User" USING btree ("phoneNumber" text_ops);--> statement-breakpoint
CREATE INDEX "User_userId_idx" ON "User" USING btree ("userId" text_ops);