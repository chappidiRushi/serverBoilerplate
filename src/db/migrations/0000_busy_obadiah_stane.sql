-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TYPE "public"."AddedByType" AS ENUM('SYSTEM', 'ADMIN', 'SUPERADMIN');--> statement-breakpoint
CREATE TYPE "public"."AuditAction" AS ENUM('ADDED', 'REVOKED', 'MODIFIED');--> statement-breakpoint
CREATE TYPE "public"."DamageType" AS ENUM('USER_DELIVERY', 'SUPPLIER_DELIVERY', 'WAREHOUSE_IN_HOUSE');--> statement-breakpoint
CREATE TYPE "public"."NotificationCategory" AS ENUM('GENERAL', 'ORDER', 'PROMOTION', 'ALERT', 'REMINDER', 'SYSTEM', 'SECURITY');--> statement-breakpoint
CREATE TYPE "public"."OrderStatus" AS ENUM('APPROVED', 'PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'RETURNED', 'PROCESSING', 'REJECTED', 'UNDER_REVIEW');--> statement-breakpoint
CREATE TYPE "public"."PaymentMethod" AS ENUM('CASH', 'ONLINE', 'UPI', 'NEFT', 'BANK_TRANSFER');--> statement-breakpoint
CREATE TYPE "public"."Size" AS ENUM('EXTRA_SMALL', 'SMALL', 'MEDIUM', 'LARGE', 'EXTRA_LARGE');--> statement-breakpoint
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
CREATE TABLE "DeliveryCharge" (
	"id" text PRIMARY KEY NOT NULL,
	"pinCode" text NOT NULL,
	"size" text NOT NULL,
	"cost" numeric(65, 30) NOT NULL,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "GlobalOverheads" (
	"overheadId" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"category" text,
	"appliesTo" text,
	"amount" numeric(65, 30) NOT NULL,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) NOT NULL,
	"deletedAt" timestamp(3)
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
CREATE TABLE "Role" (
	"roleId" text PRIMARY KEY NOT NULL,
	"role" text NOT NULL,
	"addedByUserId" text,
	"addedByType" "AddedByType" DEFAULT 'SYSTEM' NOT NULL,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) NOT NULL,
	"deletedAt" timestamp(3)
);
--> statement-breakpoint
CREATE TABLE "User" (
	"userId" text PRIMARY KEY NOT NULL,
	"roleId" text NOT NULL,
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
CREATE TABLE "RoleCreationAuditLog" (
	"logId" text PRIMARY KEY NOT NULL,
	"roleId" text NOT NULL,
	"createdById" text,
	"createdByType" "AddedByType" DEFAULT 'SYSTEM' NOT NULL,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "Action" (
	"actionId" text PRIMARY KEY NOT NULL,
	"addedByUserId" text,
	"addedByType" "AddedByType" DEFAULT 'SYSTEM' NOT NULL,
	"name" text NOT NULL,
	"displayName" text,
	"description" text,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) NOT NULL,
	"deletedAt" timestamp(3)
);
--> statement-breakpoint
CREATE TABLE "Module" (
	"moduleId" text PRIMARY KEY NOT NULL,
	"addedByUserId" text,
	"addedByType" "AddedByType" DEFAULT 'SYSTEM' NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) NOT NULL,
	"deletedAt" timestamp(3)
);
--> statement-breakpoint
CREATE TABLE "Resource" (
	"resourceId" text PRIMARY KEY NOT NULL,
	"moduleId" text NOT NULL,
	"addedByUserId" text,
	"addedByType" "AddedByType" DEFAULT 'SYSTEM' NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) NOT NULL,
	"deletedAt" timestamp(3)
);
--> statement-breakpoint
CREATE TABLE "Permission" (
	"permissionId" text PRIMARY KEY NOT NULL,
	"actionId" text NOT NULL,
	"resourceId" text NOT NULL,
	"moduleId" text NOT NULL,
	"addedByUserId" text,
	"addedByType" "AddedByType" DEFAULT 'SYSTEM' NOT NULL,
	"description" text,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) NOT NULL,
	"deletedAt" timestamp(3)
);
--> statement-breakpoint
CREATE TABLE "RolePermissionAuditLog" (
	"logId" text PRIMARY KEY NOT NULL,
	"roleId" text NOT NULL,
	"permissionId" text NOT NULL,
	"action" "AuditAction" NOT NULL,
	"reason" text,
	"addedByUserId" text,
	"addedByType" "AddedByType" DEFAULT 'SYSTEM' NOT NULL,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "UserPermissionAuditLog" (
	"logId" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"permissionId" text NOT NULL,
	"action" "AuditAction" NOT NULL,
	"previousAllowed" boolean,
	"newAllowed" boolean,
	"reason" text,
	"addedByUserId" text,
	"addedByType" "AddedByType" DEFAULT 'SYSTEM' NOT NULL,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "Group" (
	"groupId" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) NOT NULL,
	"deletedAt" timestamp(3)
);
--> statement-breakpoint
CREATE TABLE "GroupPermission" (
	"id" text PRIMARY KEY NOT NULL,
	"groupId" text NOT NULL,
	"actionId" text NOT NULL,
	"resourceId" text NOT NULL,
	"moduleId" text NOT NULL,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) NOT NULL,
	"deletedAt" timestamp(3)
);
--> statement-breakpoint
CREATE TABLE "GroupPermissionAuditLog" (
	"logId" text PRIMARY KEY NOT NULL,
	"groupId" text NOT NULL,
	"actionId" text NOT NULL,
	"resourceId" text NOT NULL,
	"moduleId" text NOT NULL,
	"action" "AuditAction" NOT NULL,
	"reason" text,
	"addedByUserId" text,
	"addedByType" "AddedByType" DEFAULT 'SYSTEM' NOT NULL,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "Customer" (
	"customerId" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"loyaltyPoints" integer DEFAULT 0 NOT NULL,
	"loyaltyTier" text,
	"preferredPayment" text,
	"totalSpent" numeric(65, 30) DEFAULT '0.0' NOT NULL,
	"orderCount" integer DEFAULT 0 NOT NULL,
	"avgOrderValue" numeric(65, 30) DEFAULT '0.0' NOT NULL,
	"daysBetweenOrders" integer,
	"orderFrequency" numeric(65, 30),
	"predictedSpend" numeric(65, 30),
	"spendTier" text,
	"isActive" boolean DEFAULT true NOT NULL,
	"firstOrderAt" timestamp(3),
	"lastOrderAt" timestamp(3),
	"lastLogin" timestamp(3),
	"accountCreatedAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) NOT NULL,
	"deletedAt" timestamp(3)
);
--> statement-breakpoint
CREATE TABLE "Admin" (
	"adminId" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) NOT NULL,
	"deletedAt" timestamp(3)
);
--> statement-breakpoint
CREATE TABLE "SuperAdmin" (
	"superAdminId" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) NOT NULL,
	"deletedAt" timestamp(3)
);
--> statement-breakpoint
CREATE TABLE "Employee" (
	"employeeId" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"designation" text,
	"department" text,
	"joiningDate" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"isActive" boolean DEFAULT true NOT NULL,
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
CREATE TABLE "WarehouseEmployee" (
	"warehouseEmployeeId" text PRIMARY KEY NOT NULL,
	"warehouseId" text NOT NULL,
	"employeeId" text NOT NULL,
	"assignedByUserId" text NOT NULL,
	"assignedAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) NOT NULL,
	"deletedAt" timestamp(3)
);
--> statement-breakpoint
CREATE TABLE "Supplier" (
	"supplierId" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"warehouseId" text,
	"nurseryName" text,
	"businessCategory" text,
	"gstin" text,
	"tradeLicenseUrl" text,
	"publicId" text,
	"status" text DEFAULT 'REGISTERED' NOT NULL,
	"isVerified" boolean DEFAULT false NOT NULL,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) NOT NULL,
	"deletedAt" timestamp(3)
);
--> statement-breakpoint
CREATE TABLE "NurseryMediaAsset" (
	"id" text PRIMARY KEY NOT NULL,
	"supplierId" text NOT NULL,
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
CREATE TABLE "CustomerSessions" (
	"sessionId" text PRIMARY KEY NOT NULL,
	"customerId" text NOT NULL,
	"deviceId" text,
	"ipAddress" text,
	"deviceInfo" text,
	"locationCity" text,
	"locationDistrict" text,
	"locationState" text,
	"loginStatus" text,
	"pagesVisited" integer,
	"firstPage" text,
	"lastPage" text,
	"sessionStart" timestamp(3) NOT NULL,
	"sessionEnd" timestamp(3) NOT NULL,
	"totalTimeSpent" integer,
	"isMobile" boolean,
	"browserName" text,
	"osName" text,
	"sessionStatus" text
);
--> statement-breakpoint
CREATE TABLE "NotifyMeSubscription" (
	"subscriptionId" text PRIMARY KEY NOT NULL,
	"customerId" text,
	"plantId" text,
	"plantVariantId" text,
	"potCategoryId" text,
	"potVariantId" text,
	"email" text NOT NULL,
	"notified" boolean DEFAULT false NOT NULL,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"notifiedAt" timestamp(3)
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
CREATE TABLE "CustomerAddress" (
	"addressId" text PRIMARY KEY NOT NULL,
	"customerId" text NOT NULL,
	"addressType" text NOT NULL,
	"address" jsonb NOT NULL,
	"isDefault" boolean DEFAULT false NOT NULL,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) NOT NULL,
	"deletedAt" timestamp(3)
);
--> statement-breakpoint
CREATE TABLE "PlantCartItem" (
	"cartItemId" text PRIMARY KEY NOT NULL,
	"customerId" text NOT NULL,
	"plantId" text NOT NULL,
	"plantVariantId" text NOT NULL,
	"couponId" text,
	"quantity" integer DEFAULT 1 NOT NULL,
	"priceAtAdd" numeric(65, 30) NOT NULL,
	"addedAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) NOT NULL,
	"deletedAt" timestamp(3)
);
--> statement-breakpoint
CREATE TABLE "PromoCode" (
	"promoCodeId" text PRIMARY KEY NOT NULL,
	"code" text NOT NULL,
	"description" text,
	"discountType" text NOT NULL,
	"discountValue" numeric(65, 30) NOT NULL,
	"minOrderAmount" numeric(65, 30),
	"maxDiscountAmount" numeric(65, 30),
	"startDate" timestamp(3) NOT NULL,
	"endDate" timestamp(3) NOT NULL,
	"isActive" boolean DEFAULT true NOT NULL,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) NOT NULL,
	"deletedAt" timestamp(3)
);
--> statement-breakpoint
CREATE TABLE "PotCartItem" (
	"cartItemId" text PRIMARY KEY NOT NULL,
	"customerId" text NOT NULL,
	"potCategoryId" text NOT NULL,
	"potVariantId" text NOT NULL,
	"couponId" text,
	"quantity" integer DEFAULT 1 NOT NULL,
	"priceAtAdd" numeric(65, 30) NOT NULL,
	"addedAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) NOT NULL,
	"deletedAt" timestamp(3)
);
--> statement-breakpoint
CREATE TABLE "PlantCheckoutLater" (
	"checkOutLaterId" text PRIMARY KEY NOT NULL,
	"customerId" char(36) NOT NULL,
	"plantId" char(36) NOT NULL,
	"plantVariantId" char(36),
	"promoCodeId" char(36),
	"units" integer NOT NULL,
	"addedAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) NOT NULL,
	"deletedAt" timestamp(3)
);
--> statement-breakpoint
CREATE TABLE "PotCheckoutLater" (
	"checkOutLaterId" text PRIMARY KEY NOT NULL,
	"customerId" char(36) NOT NULL,
	"potCategoryId" char(36) NOT NULL,
	"potVariantId" char(36),
	"promoCodeId" char(36),
	"units" integer NOT NULL,
	"addedAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) NOT NULL,
	"deletedAt" timestamp(3)
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
CREATE TABLE "PlantSizeProfile" (
	"plantSizeId" text PRIMARY KEY NOT NULL,
	"plantId" text NOT NULL,
	"plantSize" "Size" NOT NULL,
	"height" numeric(65, 30) NOT NULL,
	"weight" numeric(65, 30) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "Color" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"hexCode" text DEFAULT '#FFFFFF' NOT NULL,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) NOT NULL,
	"deletedAt" timestamp(3)
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
CREATE TABLE "PlantGenericCostComponent" (
	"componentId" text PRIMARY KEY NOT NULL,
	"tagPrintingCost" numeric(65, 30) DEFAULT '0.0' NOT NULL,
	"marketingOverheadCost" numeric(65, 30) DEFAULT '0.0' NOT NULL,
	"paymentGatewayCostPercentage" numeric(65, 30) DEFAULT '0.0' NOT NULL,
	"courierSubscriptionCost" numeric(65, 30) DEFAULT '0.0' NOT NULL,
	"taxPercentage" numeric(65, 30) DEFAULT '0.0' NOT NULL,
	"deliveryMaintenanceCost" numeric(65, 30) DEFAULT '0.0' NOT NULL,
	"returnLossPercentage" numeric(65, 30) DEFAULT '0.0' NOT NULL,
	"inventoryDamagePercentage" numeric(65, 30) DEFAULT '0.0' NOT NULL,
	"variableCost" numeric(65, 30) DEFAULT '0.0' NOT NULL,
	"totalPlantGenericCost" numeric(65, 30) DEFAULT '0.0' NOT NULL,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "PlantSizeCostComponent" (
	"sizeCostComponentId" text PRIMARY KEY NOT NULL,
	"plantSize" text NOT NULL,
	"plantCocopeatCost" numeric(65, 30) DEFAULT '0.0' NOT NULL,
	"plantPackagingCost" numeric(65, 30) DEFAULT '0.0' NOT NULL,
	"plantGiftPackagingCost" numeric(65, 30) DEFAULT '0.0' NOT NULL,
	"plantProfitMarginPercentage" numeric(65, 30) DEFAULT '0.0' NOT NULL,
	"plantFertilizersCost" numeric(65, 30) DEFAULT '0.0' NOT NULL,
	"totalPlantSizeCost" numeric(65, 30) DEFAULT '0.0' NOT NULL,
	"genericCostComponentId" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "PotGenericCostComponent" (
	"componentId" text PRIMARY KEY NOT NULL,
	"tagPrintingCost" numeric(65, 30) DEFAULT '0.0' NOT NULL,
	"marketingOverheadCost" numeric(65, 30) DEFAULT '0.0' NOT NULL,
	"paymentGatewayCostPercentage" numeric(65, 30) DEFAULT '0.0' NOT NULL,
	"courierSubscriptionCost" numeric(65, 30) DEFAULT '0.0' NOT NULL,
	"taxPercentage" numeric(65, 30) DEFAULT '0.0' NOT NULL,
	"deliveryMaintenanceCost" numeric(65, 30) DEFAULT '0.0' NOT NULL,
	"returnLossPercentage" numeric(65, 30) DEFAULT '0.0' NOT NULL,
	"inventoryDamagePercentage" numeric(65, 30) DEFAULT '0.0' NOT NULL,
	"variableCost" numeric(65, 30) DEFAULT '0.0' NOT NULL,
	"totalPotGenericCost" numeric(65, 30) DEFAULT '0.0' NOT NULL,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "PotSizeCostComponent" (
	"sizeCostComponentId" text PRIMARY KEY NOT NULL,
	"potSize" text NOT NULL,
	"potPackagingCost" numeric(65, 30) DEFAULT '0.0' NOT NULL,
	"potGiftPackagingCost" numeric(65, 30) DEFAULT '0.0' NOT NULL,
	"potProfitMarginPercentage" numeric(65, 30) DEFAULT '0.0' NOT NULL,
	"totalPotSizeCost" numeric(65, 30) DEFAULT '0.0' NOT NULL,
	"genericCostComponentId" text NOT NULL
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
CREATE TABLE "Order" (
	"orderId" text PRIMARY KEY NOT NULL,
	"invoiceNumber" text NOT NULL,
	"customerId" text NOT NULL,
	"promoCodeId" text,
	"orderDate" timestamp(3) NOT NULL,
	"shippingDate" timestamp(3),
	"deliveryDate" timestamp(3),
	"returnEligibilityDate" timestamp(3) NOT NULL,
	"orderStatus" text NOT NULL,
	"paymentStatus" text NOT NULL,
	"paymentMethod" text NOT NULL,
	"isExchangeOrder" boolean DEFAULT false NOT NULL,
	"orderAmount" numeric(65, 30) NOT NULL,
	"discountApplied" numeric(65, 30) NOT NULL,
	"shippingCharges" numeric(65, 30) NOT NULL,
	"taxCollected" numeric(65, 30) NOT NULL,
	"finalPayableAmount" numeric(65, 30) NOT NULL,
	"refundAmount" numeric(65, 30),
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) NOT NULL,
	"deletedAt" timestamp(3)
);
--> statement-breakpoint
CREATE TABLE "PlantOrderItem" (
	"orderItemId" text PRIMARY KEY NOT NULL,
	"orderId" text NOT NULL,
	"plantId" text NOT NULL,
	"plantVariantId" text NOT NULL,
	"promoCodeId" text,
	"units" integer NOT NULL,
	"unitSellingPrice" numeric(65, 30) NOT NULL,
	"totalSellingPrice" numeric(65, 30) NOT NULL,
	"discountApplied" numeric(65, 30),
	"taxApplied" numeric(65, 30),
	"finalAmountPaid" numeric(65, 30),
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) NOT NULL,
	"deletedAt" timestamp(3)
);
--> statement-breakpoint
CREATE TABLE "PotOrderItem" (
	"orderItemId" text PRIMARY KEY NOT NULL,
	"orderId" text NOT NULL,
	"potCategoryId" text NOT NULL,
	"potVariantId" text NOT NULL,
	"promoCodeId" text,
	"units" integer NOT NULL,
	"unitSellingPrice" numeric(65, 30) NOT NULL,
	"totalSellingPrice" numeric(65, 30) NOT NULL,
	"discountApplied" numeric(65, 30),
	"taxApplied" numeric(65, 30),
	"finalAmountPaid" numeric(65, 30),
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) NOT NULL,
	"deletedAt" timestamp(3)
);
--> statement-breakpoint
CREATE TABLE "Payment" (
	"paymentId" text PRIMARY KEY NOT NULL,
	"orderId" text NOT NULL,
	"transactionId" text NOT NULL,
	"method" text NOT NULL,
	"status" text NOT NULL,
	"amount" numeric(65, 30) NOT NULL,
	"paymentDate" timestamp(3) NOT NULL,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) NOT NULL,
	"deletedAt" timestamp(3)
);
--> statement-breakpoint
CREATE TABLE "OrderCostDetails" (
	"id" text PRIMARY KEY NOT NULL,
	"orderId" text NOT NULL,
	"totalProductCost" numeric(65, 30) NOT NULL,
	"totalGenericCost" numeric(65, 30) NOT NULL,
	"totalSizeCost" numeric(65, 30) NOT NULL,
	"totalCost" numeric(65, 30) NOT NULL,
	"sellingPrice" numeric(65, 30) NOT NULL,
	"profitMargin" numeric(65, 30),
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "Shipping" (
	"shippingId" text PRIMARY KEY NOT NULL,
	"orderId" text NOT NULL,
	"addressId" text NOT NULL,
	"courierName" text NOT NULL,
	"trackingNumber" text,
	"shippingStatus" text NOT NULL,
	"shippingMethod" text NOT NULL,
	"isExchangeShipment" boolean NOT NULL,
	"estimatedDeliveryDate" timestamp(3),
	"actualDeliveryDate" timestamp(3),
	"deliveredAt" timestamp(3),
	"shippingCharges" numeric(65, 30) NOT NULL,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) NOT NULL,
	"deletedAt" timestamp(3)
);
--> statement-breakpoint
CREATE TABLE "ReturnsRefunds" (
	"returnId" text PRIMARY KEY NOT NULL,
	"orderId" text NOT NULL,
	"plantId" text NOT NULL,
	"customerId" text NOT NULL,
	"exchangeProductId" text,
	"exchangeShippingId" text,
	"reason" text NOT NULL,
	"remarks" text,
	"returnStatus" text NOT NULL,
	"refundStatus" text NOT NULL,
	"refundAmount" numeric(65, 30) NOT NULL,
	"returnShippingCharges" numeric(65, 30) NOT NULL,
	"returnCourier" text,
	"returnTrackingNo" text,
	"returnRequestDate" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"actualReturnPickupDate" timestamp(3),
	"updatedAt" timestamp(3) NOT NULL,
	"deletedAt" timestamp(3)
);
--> statement-breakpoint
CREATE TABLE "Promotion" (
	"promoId" text PRIMARY KEY NOT NULL,
	"promoName" text NOT NULL,
	"description" text,
	"discountType" text NOT NULL,
	"discountValue" numeric(65, 30) NOT NULL,
	"maxDiscount" numeric(65, 30),
	"validFrom" timestamp(3) NOT NULL,
	"validTo" timestamp(3) NOT NULL,
	"usageLimit" integer,
	"usageCount" integer DEFAULT 0 NOT NULL,
	"stackable" boolean DEFAULT false NOT NULL,
	"isActive" boolean DEFAULT true NOT NULL,
	"deletedAt" timestamp(3),
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "PromotionProduct" (
	"id" text PRIMARY KEY NOT NULL,
	"promoId" text NOT NULL,
	"plantId" text,
	"plantVariantId" text,
	"potCategoryId" text,
	"potVariantId" text,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) NOT NULL,
	"deletedAt" timestamp(3)
);
--> statement-breakpoint
CREATE TABLE "ReferralCode" (
	"referralId" text PRIMARY KEY NOT NULL,
	"referralCode" text NOT NULL,
	"referrerCustomerId" text NOT NULL,
	"rewardType" text NOT NULL,
	"rewardValue" numeric(65, 30),
	"eligibility" text,
	"isActive" boolean DEFAULT true NOT NULL,
	"deletedAt" timestamp(3),
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ReferralUsage" (
	"usageId" text PRIMARY KEY NOT NULL,
	"referralId" text NOT NULL,
	"referredCustomerId" text NOT NULL,
	"used" boolean DEFAULT false NOT NULL,
	"referredAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"usedAt" timestamp(3),
	"rewardGranted" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE "PlantStockAuditLog" (
	"auditId" text PRIMARY KEY NOT NULL,
	"plantId" text NOT NULL,
	"plantVariantId" text,
	"warehouseId" text NOT NULL,
	"eventType" text NOT NULL,
	"stockDelta" integer NOT NULL,
	"sourceTable" text NOT NULL,
	"sourceRefId" text NOT NULL,
	"userId" text NOT NULL,
	"notes" text,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE "PotStockAuditLog" (
	"auditId" text PRIMARY KEY NOT NULL,
	"potCategoryId" text NOT NULL,
	"potVariantId" text,
	"warehouseId" text NOT NULL,
	"eventType" text NOT NULL,
	"stockDelta" integer NOT NULL,
	"sourceTable" text NOT NULL,
	"sourceRefId" text NOT NULL,
	"userId" text NOT NULL,
	"notes" text,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE "PlantDamagedProduct" (
	"damageId" text PRIMARY KEY NOT NULL,
	"plantId" text NOT NULL,
	"plantVariantId" text,
	"warehouseId" text NOT NULL,
	"purchaseOrderId" text,
	"purchaseOrderItemId" text,
	"orderId" text,
	"plantOrderItemId" text,
	"handledById" text NOT NULL,
	"damageType" "DamageType" NOT NULL,
	"unitsDamaged" integer NOT NULL,
	"unitsDamagedPrice" numeric(65, 30) NOT NULL,
	"totalAmount" numeric(65, 30) NOT NULL,
	"reason" text NOT NULL,
	"notes" text,
	"handledBy" text NOT NULL,
	"reportDate" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"publicId" text NOT NULL,
	"mediaUrl" text NOT NULL,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) NOT NULL,
	"deletedAt" timestamp(3)
);
--> statement-breakpoint
CREATE TABLE "PurchaseOrder" (
	"id" text PRIMARY KEY NOT NULL,
	"warehouseId" text NOT NULL,
	"supplierId" text NOT NULL,
	"deliveryCharges" numeric(65, 30),
	"totalCost" numeric(65, 30),
	"pendingAmount" numeric(65, 30),
	"paymentPercentage" integer DEFAULT 0 NOT NULL,
	"status" "OrderStatus" DEFAULT 'PENDING' NOT NULL,
	"isAccepted" boolean DEFAULT false NOT NULL,
	"invoiceUrl" text,
	"expectedDateOfArrival" timestamp(3) NOT NULL,
	"requestedAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"acceptedAt" timestamp(3),
	"deliveredAt" timestamp(3),
	"updatedAt" timestamp(3) NOT NULL,
	"supplierReviewNotes" text,
	"warehouseManagerReviewNotes" text
);
--> statement-breakpoint
CREATE TABLE "PurchaseOrderItems" (
	"id" text PRIMARY KEY NOT NULL,
	"purchaseOrderId" text NOT NULL,
	"productType" text NOT NULL,
	"plantId" text,
	"plantVariantId" text,
	"potCategoryId" text,
	"potVariantId" text,
	"unitsRequested" integer NOT NULL,
	"unitCostPrice" numeric(65, 30),
	"totalCost" numeric(65, 30),
	"status" "OrderStatus" DEFAULT 'PENDING' NOT NULL,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "PotDamagedProduct" (
	"damageId" text PRIMARY KEY NOT NULL,
	"potCategoryId" text NOT NULL,
	"potVariantId" text,
	"warehouseId" text NOT NULL,
	"purchaseOrderId" text,
	"purchaseOrderItemId" text,
	"orderId" text,
	"potOrderItemId" text,
	"handledById" text NOT NULL,
	"damageType" "DamageType" NOT NULL,
	"unitsDamaged" integer NOT NULL,
	"unitsDamagedPrice" numeric(65, 30) NOT NULL,
	"totalAmount" numeric(65, 30) NOT NULL,
	"reason" text NOT NULL,
	"notes" text,
	"handledBy" text NOT NULL,
	"reportDate" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"publicId" text NOT NULL,
	"mediaUrl" text NOT NULL,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) NOT NULL,
	"deletedAt" timestamp(3)
);
--> statement-breakpoint
CREATE TABLE "Review" (
	"reviewId" text PRIMARY KEY NOT NULL,
	"plantId" text,
	"plantVariantId" text,
	"potCategoryId" text,
	"potVariantId" text,
	"customerId" text,
	"rating" integer NOT NULL,
	"reviewText" text,
	"reviewDate" timestamp(3) NOT NULL,
	"isVerifiedCustomer" boolean NOT NULL,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) NOT NULL,
	"deletedAt" timestamp(3)
);
--> statement-breakpoint
CREATE TABLE "ReviewImage" (
	"id" text PRIMARY KEY NOT NULL,
	"reviewId" text NOT NULL,
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
CREATE TABLE "WebsiteAnalytics" (
	"sessionId" text PRIMARY KEY NOT NULL,
	"customerId" text NOT NULL,
	"pageVisited" text NOT NULL,
	"timeSpent" numeric(65, 30) NOT NULL,
	"bounceRate" numeric(65, 30) NOT NULL,
	"conversionRate" numeric(65, 30) NOT NULL,
	"netSales" numeric(65, 30) NOT NULL,
	"costTotal" numeric(65, 30) NOT NULL,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE "PlantSalesAnalytics" (
	"analyticsId" text PRIMARY KEY NOT NULL,
	"plantId" text NOT NULL,
	"plantVariantId" text NOT NULL,
	"totalUnitsSold" integer DEFAULT 0 NOT NULL,
	"totalUnitsReturned" integer DEFAULT 0 NOT NULL,
	"averageSellingPrice" numeric(65, 30) DEFAULT '0.0' NOT NULL,
	"averageTrueCost" numeric(65, 30) DEFAULT '0.0' NOT NULL,
	"profitMargin" numeric(65, 30) DEFAULT '0.0' NOT NULL,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) NOT NULL,
	"deletedAt" timestamp(3)
);
--> statement-breakpoint
CREATE TABLE "PotSalesAnalytics" (
	"analyticsId" text PRIMARY KEY NOT NULL,
	"potCategoryId" text NOT NULL,
	"potVariantId" text NOT NULL,
	"totalUnitsSold" integer DEFAULT 0 NOT NULL,
	"totalUnitsReturned" integer DEFAULT 0 NOT NULL,
	"averageSellingPrice" numeric(65, 30) DEFAULT '0.0' NOT NULL,
	"averageTrueCost" numeric(65, 30) DEFAULT '0.0' NOT NULL,
	"profitMargin" numeric(65, 30) DEFAULT '0.0' NOT NULL,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) NOT NULL,
	"deletedAt" timestamp(3)
);
--> statement-breakpoint
CREATE TABLE "PlantWarehouseInventory" (
	"id" text PRIMARY KEY NOT NULL,
	"plantId" text NOT NULL,
	"variantId" text NOT NULL,
	"warehouseId" text NOT NULL,
	"stockIn" integer DEFAULT 0,
	"stockOut" integer DEFAULT 0,
	"stockLossCount" integer DEFAULT 0,
	"latestQuantityAdded" integer DEFAULT 0,
	"currentStock" integer DEFAULT 0,
	"reservedUnit" integer DEFAULT 0,
	"totalCost" numeric(65, 30) DEFAULT '0.0',
	"trueCostPrice" numeric(65, 30) DEFAULT '0.0',
	"lastRestocked" timestamp(3) NOT NULL,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) NOT NULL,
	"deletedAt" timestamp(3)
);
--> statement-breakpoint
CREATE TABLE "PotWarehouseInventory" (
	"id" text PRIMARY KEY NOT NULL,
	"potCategoryId" text NOT NULL,
	"potVariantId" text NOT NULL,
	"warehouseId" text NOT NULL,
	"stockIn" integer DEFAULT 0,
	"stockOut" integer DEFAULT 0,
	"stockLossCount" integer DEFAULT 0,
	"latestQuantityAdded" integer DEFAULT 0,
	"currentStock" integer DEFAULT 0,
	"reservedUnit" integer DEFAULT 0,
	"totalCost" numeric(65, 30) DEFAULT '0.0',
	"trueCostPrice" numeric(65, 30) DEFAULT '0.0',
	"lastRestocked" timestamp(3) NOT NULL,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) NOT NULL,
	"deletedAt" timestamp(3)
);
--> statement-breakpoint
CREATE TABLE "PlantRestockEventLog" (
	"restockId" text PRIMARY KEY NOT NULL,
	"supplierId" text NOT NULL,
	"plantId" text NOT NULL,
	"plantVariantId" text NOT NULL,
	"warehouseId" text NOT NULL,
	"purchaseOrderId" text NOT NULL,
	"units" integer NOT NULL,
	"unitCostPrice" numeric(65, 30) NOT NULL,
	"totalCost" numeric(65, 30) NOT NULL,
	"restockDate" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE "PotRestockEventLog" (
	"restockId" text PRIMARY KEY NOT NULL,
	"supplierId" text NOT NULL,
	"potVariantId" text NOT NULL,
	"potCategoryId" text NOT NULL,
	"warehouseId" text NOT NULL,
	"purchaseOrderId" text NOT NULL,
	"units" integer NOT NULL,
	"unitCostPrice" numeric(65, 30) NOT NULL,
	"totalCost" numeric(65, 30) NOT NULL,
	"restockDate" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE "WarehouseCartItem" (
	"cartItemId" text PRIMARY KEY NOT NULL,
	"warehouseId" text NOT NULL,
	"supplierId" text NOT NULL,
	"plantId" text,
	"plantVariantId" text,
	"potCategoryId" text,
	"potVariantId" text,
	"productType" text NOT NULL,
	"unitsRequested" integer DEFAULT 1 NOT NULL,
	"unitCostPrice" numeric(65, 30),
	"addedAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) NOT NULL,
	"deletedAt" timestamp(3)
);
--> statement-breakpoint
CREATE TABLE "PurchaseOrderPayment" (
	"paymentId" text PRIMARY KEY NOT NULL,
	"orderId" text NOT NULL,
	"paidBy" text NOT NULL,
	"amount" numeric(65, 30) NOT NULL,
	"status" text DEFAULT 'PENDING' NOT NULL,
	"paymentMethod" text NOT NULL,
	"transactionId" text,
	"remarks" text,
	"receiptUrl" text,
	"publicId" text,
	"resourceType" text,
	"requestedAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"paidAt" timestamp(3)
);
--> statement-breakpoint
CREATE TABLE "PurchaseOrderMedia" (
	"id" text PRIMARY KEY NOT NULL,
	"purchaseOrderId" text NOT NULL,
	"uploadedBy" text NOT NULL,
	"publicId" text NOT NULL,
	"mediaUrl" text NOT NULL,
	"mediaType" text NOT NULL,
	"resourceType" text,
	"isPrimary" boolean DEFAULT false NOT NULL,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) NOT NULL,
	"deletedAt" timestamp(3)
);
--> statement-breakpoint
CREATE TABLE "PlantSupplierInventory" (
	"supplierInventoryId" text PRIMARY KEY NOT NULL,
	"supplierId" text NOT NULL,
	"plantId" text NOT NULL,
	"plantVariantId" text,
	"stockIn" integer NOT NULL,
	"stockOut" integer NOT NULL,
	"stockAdjustment" integer NOT NULL,
	"currentStock" integer NOT NULL,
	"reorderLevel" integer NOT NULL,
	"lastRestocked" timestamp(3) NOT NULL,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) NOT NULL,
	"deletedAt" timestamp(3)
);
--> statement-breakpoint
CREATE TABLE "PotSupplierInventory" (
	"supplierInventoryId" text PRIMARY KEY NOT NULL,
	"supplierId" text NOT NULL,
	"potCategoryId" text NOT NULL,
	"potVariantId" text,
	"stockIn" integer NOT NULL,
	"stockOut" integer NOT NULL,
	"stockAdjustment" integer NOT NULL,
	"currentStock" integer NOT NULL,
	"reorderLevel" integer NOT NULL,
	"lastRestocked" timestamp(3) NOT NULL,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) NOT NULL,
	"deletedAt" timestamp(3)
);
--> statement-breakpoint
CREATE TABLE "EmailVerification" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text,
	"email" text NOT NULL,
	"token" text NOT NULL,
	"expiresAt" timestamp(3) NOT NULL,
	"verified" boolean DEFAULT false NOT NULL,
	"verifiedAt" timestamp(3),
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "PhoneVerification" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text,
	"phoneNumber" text NOT NULL,
	"otp" text NOT NULL,
	"expiresAt" timestamp(3) NOT NULL,
	"verified" boolean DEFAULT false NOT NULL,
	"verifiedAt" timestamp(3),
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) NOT NULL
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
CREATE TABLE "PotVariants" (
	"potVariantId" text PRIMARY KEY NOT NULL,
	"colorId" text NOT NULL,
	"potName" text NOT NULL,
	"sku" text NOT NULL,
	"mrp" numeric(65, 30) DEFAULT '0.0' NOT NULL,
	"variantUnits" integer DEFAULT 0 NOT NULL,
	"isEcoFriendly" boolean DEFAULT false NOT NULL,
	"isPremium" boolean DEFAULT false NOT NULL,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) NOT NULL,
	"deletedAt" timestamp(3),
	"sizeMaterialOptionId" text NOT NULL
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
CREATE TABLE "SizeMaterialOption" (
	"sizeMaterialOptionId" text PRIMARY KEY NOT NULL,
	"potSizeProfileId" text NOT NULL,
	"materialId" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "_ProductCategories" (
	"A" text NOT NULL,
	"B" text NOT NULL,
	CONSTRAINT "_ProductCategories_AB_pkey" PRIMARY KEY("A","B")
);
--> statement-breakpoint
CREATE TABLE "_CompatiblePots" (
	"A" text NOT NULL,
	"B" text NOT NULL,
	CONSTRAINT "_CompatiblePots_AB_pkey" PRIMARY KEY("A","B")
);
--> statement-breakpoint
CREATE TABLE "_PlantVariantToTags" (
	"A" text NOT NULL,
	"B" text NOT NULL,
	CONSTRAINT "_PlantVariantToTags_AB_pkey" PRIMARY KEY("A","B")
);
--> statement-breakpoint
CREATE TABLE "_PotVariantToTags" (
	"A" text NOT NULL,
	"B" text NOT NULL,
	CONSTRAINT "_PotVariantToTags_AB_pkey" PRIMARY KEY("A","B")
);
--> statement-breakpoint
CREATE TABLE "RolePermission" (
	"roleId" text NOT NULL,
	"permissionId" text NOT NULL,
	"addedByUserId" text,
	"addedByType" "AddedByType" DEFAULT 'SYSTEM' NOT NULL,
	"reason" text,
	CONSTRAINT "RolePermission_pkey" PRIMARY KEY("roleId","permissionId")
);
--> statement-breakpoint
CREATE TABLE "UserGroup" (
	"userId" text NOT NULL,
	"groupId" text NOT NULL,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) NOT NULL,
	"deletedAt" timestamp(3),
	CONSTRAINT "UserGroup_pkey" PRIMARY KEY("userId","groupId")
);
--> statement-breakpoint
CREATE TABLE "GroupRole" (
	"groupId" text NOT NULL,
	"roleId" text NOT NULL,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) NOT NULL,
	"deletedAt" timestamp(3),
	CONSTRAINT "GroupRole_pkey" PRIMARY KEY("groupId","roleId")
);
--> statement-breakpoint
CREATE TABLE "UserPermission" (
	"userId" text NOT NULL,
	"permissionId" text NOT NULL,
	"allowed" boolean NOT NULL,
	"addedByUserId" text,
	"addedByType" "AddedByType" DEFAULT 'SYSTEM' NOT NULL,
	"reason" text,
	CONSTRAINT "UserPermission_pkey" PRIMARY KEY("userId","permissionId")
);
--> statement-breakpoint
ALTER TABLE "Role" ADD CONSTRAINT "Role_addedByUserId_fkey" FOREIGN KEY ("addedByUserId") REFERENCES "public"."User"("userId") ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "User" ADD CONSTRAINT "User_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "public"."Role"("roleId") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "RoleCreationAuditLog" ADD CONSTRAINT "RoleCreationAuditLog_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "public"."Role"("roleId") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "RoleCreationAuditLog" ADD CONSTRAINT "RoleCreationAuditLog_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "public"."User"("userId") ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "Action" ADD CONSTRAINT "Action_addedByUserId_fkey" FOREIGN KEY ("addedByUserId") REFERENCES "public"."User"("userId") ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "Module" ADD CONSTRAINT "Module_addedByUserId_fkey" FOREIGN KEY ("addedByUserId") REFERENCES "public"."User"("userId") ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "Resource" ADD CONSTRAINT "Resource_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "public"."Module"("moduleId") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "Resource" ADD CONSTRAINT "Resource_addedByUserId_fkey" FOREIGN KEY ("addedByUserId") REFERENCES "public"."User"("userId") ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "Permission" ADD CONSTRAINT "Permission_actionId_fkey" FOREIGN KEY ("actionId") REFERENCES "public"."Action"("actionId") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "Permission" ADD CONSTRAINT "Permission_resourceId_fkey" FOREIGN KEY ("resourceId") REFERENCES "public"."Resource"("resourceId") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "Permission" ADD CONSTRAINT "Permission_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "public"."Module"("moduleId") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "Permission" ADD CONSTRAINT "Permission_addedByUserId_fkey" FOREIGN KEY ("addedByUserId") REFERENCES "public"."User"("userId") ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "RolePermissionAuditLog" ADD CONSTRAINT "RolePermissionAuditLog_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "public"."Role"("roleId") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "RolePermissionAuditLog" ADD CONSTRAINT "RolePermissionAuditLog_permissionId_fkey" FOREIGN KEY ("permissionId") REFERENCES "public"."Permission"("permissionId") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "RolePermissionAuditLog" ADD CONSTRAINT "RolePermissionAuditLog_addedByUserId_fkey" FOREIGN KEY ("addedByUserId") REFERENCES "public"."User"("userId") ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "UserPermissionAuditLog" ADD CONSTRAINT "UserPermissionAuditLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("userId") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "UserPermissionAuditLog" ADD CONSTRAINT "UserPermissionAuditLog_permissionId_fkey" FOREIGN KEY ("permissionId") REFERENCES "public"."Permission"("permissionId") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "UserPermissionAuditLog" ADD CONSTRAINT "UserPermissionAuditLog_addedByUserId_fkey" FOREIGN KEY ("addedByUserId") REFERENCES "public"."User"("userId") ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "GroupPermission" ADD CONSTRAINT "GroupPermission_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "public"."Group"("groupId") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "GroupPermission" ADD CONSTRAINT "GroupPermission_actionId_fkey" FOREIGN KEY ("actionId") REFERENCES "public"."Action"("actionId") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "GroupPermission" ADD CONSTRAINT "GroupPermission_resourceId_fkey" FOREIGN KEY ("resourceId") REFERENCES "public"."Resource"("resourceId") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "GroupPermission" ADD CONSTRAINT "GroupPermission_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "public"."Module"("moduleId") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "GroupPermissionAuditLog" ADD CONSTRAINT "GroupPermissionAuditLog_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "public"."Group"("groupId") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "GroupPermissionAuditLog" ADD CONSTRAINT "GroupPermissionAuditLog_addedByUserId_fkey" FOREIGN KEY ("addedByUserId") REFERENCES "public"."User"("userId") ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "GroupPermissionAuditLog" ADD CONSTRAINT "GroupPermissionAuditLog_actionId_fkey" FOREIGN KEY ("actionId") REFERENCES "public"."Action"("actionId") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "GroupPermissionAuditLog" ADD CONSTRAINT "GroupPermissionAuditLog_resourceId_fkey" FOREIGN KEY ("resourceId") REFERENCES "public"."Resource"("resourceId") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "GroupPermissionAuditLog" ADD CONSTRAINT "GroupPermissionAuditLog_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "public"."Module"("moduleId") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "Customer" ADD CONSTRAINT "Customer_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("userId") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "Admin" ADD CONSTRAINT "Admin_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("userId") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "SuperAdmin" ADD CONSTRAINT "SuperAdmin_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("userId") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "Employee" ADD CONSTRAINT "Employee_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("userId") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "WarehouseEmployee" ADD CONSTRAINT "WarehouseEmployee_warehouseId_fkey" FOREIGN KEY ("warehouseId") REFERENCES "public"."Warehouse"("warehouseId") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "WarehouseEmployee" ADD CONSTRAINT "WarehouseEmployee_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "public"."Employee"("employeeId") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "WarehouseEmployee" ADD CONSTRAINT "WarehouseEmployee_assignedByUserId_fkey" FOREIGN KEY ("assignedByUserId") REFERENCES "public"."User"("userId") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "Supplier" ADD CONSTRAINT "Supplier_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("userId") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "Supplier" ADD CONSTRAINT "Supplier_warehouseId_fkey" FOREIGN KEY ("warehouseId") REFERENCES "public"."Warehouse"("warehouseId") ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "NurseryMediaAsset" ADD CONSTRAINT "NurseryMediaAsset_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "public"."Supplier"("supplierId") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "CustomerSessions" ADD CONSTRAINT "CustomerSessions_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "public"."Customer"("customerId") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "NotifyMeSubscription" ADD CONSTRAINT "NotifyMeSubscription_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "public"."Customer"("customerId") ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "NotifyMeSubscription" ADD CONSTRAINT "NotifyMeSubscription_plantId_fkey" FOREIGN KEY ("plantId") REFERENCES "public"."Plants"("plantId") ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "NotifyMeSubscription" ADD CONSTRAINT "NotifyMeSubscription_plantVariantId_fkey" FOREIGN KEY ("plantVariantId") REFERENCES "public"."PlantVariants"("variantId") ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "NotifyMeSubscription" ADD CONSTRAINT "NotifyMeSubscription_potCategoryId_fkey" FOREIGN KEY ("potCategoryId") REFERENCES "public"."PotCategory"("categoryId") ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "NotifyMeSubscription" ADD CONSTRAINT "NotifyMeSubscription_potVariantId_fkey" FOREIGN KEY ("potVariantId") REFERENCES "public"."PotVariants"("potVariantId") ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "PlantVariants" ADD CONSTRAINT "PlantVariants_plantId_fkey" FOREIGN KEY ("plantId") REFERENCES "public"."Plants"("plantId") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "PlantVariants" ADD CONSTRAINT "PlantVariants_colorId_fkey" FOREIGN KEY ("colorId") REFERENCES "public"."Color"("id") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "PlantVariants" ADD CONSTRAINT "PlantVariants_plantSizeId_fkey" FOREIGN KEY ("plantSizeId") REFERENCES "public"."PlantSizeProfile"("plantSizeId") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "CustomerAddress" ADD CONSTRAINT "CustomerAddress_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "public"."Customer"("customerId") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "PlantCartItem" ADD CONSTRAINT "PlantCartItem_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "public"."Customer"("customerId") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "PlantCartItem" ADD CONSTRAINT "PlantCartItem_plantId_fkey" FOREIGN KEY ("plantId") REFERENCES "public"."Plants"("plantId") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "PlantCartItem" ADD CONSTRAINT "PlantCartItem_plantVariantId_fkey" FOREIGN KEY ("plantVariantId") REFERENCES "public"."PlantVariants"("variantId") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "PlantCartItem" ADD CONSTRAINT "PlantCartItem_couponId_fkey" FOREIGN KEY ("couponId") REFERENCES "public"."PromoCode"("promoCodeId") ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "PotCartItem" ADD CONSTRAINT "PotCartItem_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "public"."Customer"("customerId") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "PotCartItem" ADD CONSTRAINT "PotCartItem_potCategoryId_fkey" FOREIGN KEY ("potCategoryId") REFERENCES "public"."PotCategory"("categoryId") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "PotCartItem" ADD CONSTRAINT "PotCartItem_potVariantId_fkey" FOREIGN KEY ("potVariantId") REFERENCES "public"."PotVariants"("potVariantId") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "PotCartItem" ADD CONSTRAINT "PotCartItem_couponId_fkey" FOREIGN KEY ("couponId") REFERENCES "public"."PromoCode"("promoCodeId") ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "PlantCheckoutLater" ADD CONSTRAINT "PlantCheckoutLater_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "public"."Customer"("customerId") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "PlantCheckoutLater" ADD CONSTRAINT "PlantCheckoutLater_plantId_fkey" FOREIGN KEY ("plantId") REFERENCES "public"."Plants"("plantId") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "PlantCheckoutLater" ADD CONSTRAINT "PlantCheckoutLater_plantVariantId_fkey" FOREIGN KEY ("plantVariantId") REFERENCES "public"."PlantVariants"("variantId") ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "PlantCheckoutLater" ADD CONSTRAINT "PlantCheckoutLater_promoCodeId_fkey" FOREIGN KEY ("promoCodeId") REFERENCES "public"."PromoCode"("promoCodeId") ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "PotCheckoutLater" ADD CONSTRAINT "PotCheckoutLater_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "public"."Customer"("customerId") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "PotCheckoutLater" ADD CONSTRAINT "PotCheckoutLater_potCategoryId_fkey" FOREIGN KEY ("potCategoryId") REFERENCES "public"."PotCategory"("categoryId") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "PotCheckoutLater" ADD CONSTRAINT "PotCheckoutLater_potVariantId_fkey" FOREIGN KEY ("potVariantId") REFERENCES "public"."PotVariants"("potVariantId") ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "PotCheckoutLater" ADD CONSTRAINT "PotCheckoutLater_promoCodeId_fkey" FOREIGN KEY ("promoCodeId") REFERENCES "public"."PromoCode"("promoCodeId") ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "PotVariantImage" ADD CONSTRAINT "PotVariantImage_potVariantId_fkey" FOREIGN KEY ("potVariantId") REFERENCES "public"."PotVariants"("potVariantId") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "PlantVariantImage" ADD CONSTRAINT "PlantVariantImage_plantVariantId_fkey" FOREIGN KEY ("plantVariantId") REFERENCES "public"."PlantVariants"("variantId") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "PlantSizeProfile" ADD CONSTRAINT "PlantSizeProfile_plantId_fkey" FOREIGN KEY ("plantId") REFERENCES "public"."Plants"("plantId") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "PlantCareGuidelines" ADD CONSTRAINT "PlantCareGuidelines_plantSizeId_fkey" FOREIGN KEY ("plantSizeId") REFERENCES "public"."PlantSizeProfile"("plantSizeId") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "PlantCareGuidelines" ADD CONSTRAINT "PlantCareGuidelines_sunlightTypeId_fkey" FOREIGN KEY ("sunlightTypeId") REFERENCES "public"."SunlightTypes"("sunlightId") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "PlantCareGuidelines" ADD CONSTRAINT "PlantCareGuidelines_humidityLevelId_fkey" FOREIGN KEY ("humidityLevelId") REFERENCES "public"."HumidityLevel"("humidityId") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "PlantFertilizerSchedule" ADD CONSTRAINT "PlantFertilizerSchedule_plantSizeId_fkey" FOREIGN KEY ("plantSizeId") REFERENCES "public"."PlantSizeProfile"("plantSizeId") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "PlantFertilizerSchedule" ADD CONSTRAINT "PlantFertilizerSchedule_fertilizerId_fkey" FOREIGN KEY ("fertilizerId") REFERENCES "public"."Fertilizers"("fertilizerId") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "PlantSizeCostComponent" ADD CONSTRAINT "PlantSizeCostComponent_genericCostComponentId_fkey" FOREIGN KEY ("genericCostComponentId") REFERENCES "public"."PlantGenericCostComponent"("componentId") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "PotSizeCostComponent" ADD CONSTRAINT "PotSizeCostComponent_genericCostComponentId_fkey" FOREIGN KEY ("genericCostComponentId") REFERENCES "public"."PotGenericCostComponent"("componentId") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "Tags" ADD CONSTRAINT "Tags_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "public"."TagGroups"("groupId") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "Order" ADD CONSTRAINT "Order_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "public"."Customer"("customerId") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "Order" ADD CONSTRAINT "Order_promoCodeId_fkey" FOREIGN KEY ("promoCodeId") REFERENCES "public"."PromoCode"("promoCodeId") ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "PlantOrderItem" ADD CONSTRAINT "PlantOrderItem_plantId_fkey" FOREIGN KEY ("plantId") REFERENCES "public"."Plants"("plantId") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "PlantOrderItem" ADD CONSTRAINT "PlantOrderItem_plantVariantId_fkey" FOREIGN KEY ("plantVariantId") REFERENCES "public"."PlantVariants"("variantId") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "PlantOrderItem" ADD CONSTRAINT "PlantOrderItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "public"."Order"("orderId") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "PlantOrderItem" ADD CONSTRAINT "PlantOrderItem_promoCodeId_fkey" FOREIGN KEY ("promoCodeId") REFERENCES "public"."PromoCode"("promoCodeId") ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "PotOrderItem" ADD CONSTRAINT "PotOrderItem_potCategoryId_fkey" FOREIGN KEY ("potCategoryId") REFERENCES "public"."PotCategory"("categoryId") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "PotOrderItem" ADD CONSTRAINT "PotOrderItem_potVariantId_fkey" FOREIGN KEY ("potVariantId") REFERENCES "public"."PotVariants"("potVariantId") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "PotOrderItem" ADD CONSTRAINT "PotOrderItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "public"."Order"("orderId") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "PotOrderItem" ADD CONSTRAINT "PotOrderItem_promoCodeId_fkey" FOREIGN KEY ("promoCodeId") REFERENCES "public"."PromoCode"("promoCodeId") ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "public"."Order"("orderId") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "OrderCostDetails" ADD CONSTRAINT "OrderCostDetails_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "public"."Order"("orderId") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "Shipping" ADD CONSTRAINT "Shipping_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "public"."CustomerAddress"("addressId") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "Shipping" ADD CONSTRAINT "Shipping_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "public"."Order"("orderId") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "ReturnsRefunds" ADD CONSTRAINT "ReturnsRefunds_plantId_fkey" FOREIGN KEY ("plantId") REFERENCES "public"."Plants"("plantId") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "ReturnsRefunds" ADD CONSTRAINT "ReturnsRefunds_exchangeProductId_fkey" FOREIGN KEY ("exchangeProductId") REFERENCES "public"."Plants"("plantId") ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "ReturnsRefunds" ADD CONSTRAINT "ReturnsRefunds_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "public"."Order"("orderId") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "ReturnsRefunds" ADD CONSTRAINT "ReturnsRefunds_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "public"."Customer"("customerId") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "ReturnsRefunds" ADD CONSTRAINT "ReturnsRefunds_exchangeShippingId_fkey" FOREIGN KEY ("exchangeShippingId") REFERENCES "public"."Shipping"("shippingId") ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "PromotionProduct" ADD CONSTRAINT "PromotionProduct_promoId_fkey" FOREIGN KEY ("promoId") REFERENCES "public"."Promotion"("promoId") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "PromotionProduct" ADD CONSTRAINT "PromotionProduct_plantId_fkey" FOREIGN KEY ("plantId") REFERENCES "public"."Plants"("plantId") ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "PromotionProduct" ADD CONSTRAINT "PromotionProduct_plantVariantId_fkey" FOREIGN KEY ("plantVariantId") REFERENCES "public"."PlantVariants"("variantId") ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "PromotionProduct" ADD CONSTRAINT "PromotionProduct_potCategoryId_fkey" FOREIGN KEY ("potCategoryId") REFERENCES "public"."PotCategory"("categoryId") ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "PromotionProduct" ADD CONSTRAINT "PromotionProduct_potVariantId_fkey" FOREIGN KEY ("potVariantId") REFERENCES "public"."PotVariants"("potVariantId") ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "ReferralCode" ADD CONSTRAINT "ReferralCode_referrerCustomerId_fkey" FOREIGN KEY ("referrerCustomerId") REFERENCES "public"."Customer"("customerId") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "ReferralUsage" ADD CONSTRAINT "ReferralUsage_referralId_fkey" FOREIGN KEY ("referralId") REFERENCES "public"."ReferralCode"("referralId") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "ReferralUsage" ADD CONSTRAINT "ReferralUsage_referredCustomerId_fkey" FOREIGN KEY ("referredCustomerId") REFERENCES "public"."Customer"("customerId") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "PlantStockAuditLog" ADD CONSTRAINT "PlantStockAuditLog_plantId_fkey" FOREIGN KEY ("plantId") REFERENCES "public"."Plants"("plantId") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "PlantStockAuditLog" ADD CONSTRAINT "PlantStockAuditLog_plantVariantId_fkey" FOREIGN KEY ("plantVariantId") REFERENCES "public"."PlantVariants"("variantId") ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "PlantStockAuditLog" ADD CONSTRAINT "PlantStockAuditLog_warehouseId_fkey" FOREIGN KEY ("warehouseId") REFERENCES "public"."Warehouse"("warehouseId") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "PotStockAuditLog" ADD CONSTRAINT "PotStockAuditLog_potCategoryId_fkey" FOREIGN KEY ("potCategoryId") REFERENCES "public"."PotCategory"("categoryId") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "PotStockAuditLog" ADD CONSTRAINT "PotStockAuditLog_potVariantId_fkey" FOREIGN KEY ("potVariantId") REFERENCES "public"."PotVariants"("potVariantId") ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "PotStockAuditLog" ADD CONSTRAINT "PotStockAuditLog_warehouseId_fkey" FOREIGN KEY ("warehouseId") REFERENCES "public"."Warehouse"("warehouseId") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "PlantDamagedProduct" ADD CONSTRAINT "PlantDamagedProduct_plantId_fkey" FOREIGN KEY ("plantId") REFERENCES "public"."Plants"("plantId") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "PlantDamagedProduct" ADD CONSTRAINT "PlantDamagedProduct_plantVariantId_fkey" FOREIGN KEY ("plantVariantId") REFERENCES "public"."PlantVariants"("variantId") ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "PlantDamagedProduct" ADD CONSTRAINT "PlantDamagedProduct_warehouseId_fkey" FOREIGN KEY ("warehouseId") REFERENCES "public"."Warehouse"("warehouseId") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "PlantDamagedProduct" ADD CONSTRAINT "PlantDamagedProduct_purchaseOrderId_fkey" FOREIGN KEY ("purchaseOrderId") REFERENCES "public"."PurchaseOrder"("id") ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "PlantDamagedProduct" ADD CONSTRAINT "PlantDamagedProduct_purchaseOrderItemId_fkey" FOREIGN KEY ("purchaseOrderItemId") REFERENCES "public"."PurchaseOrderItems"("id") ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "PlantDamagedProduct" ADD CONSTRAINT "PlantDamagedProduct_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "public"."Order"("orderId") ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "PlantDamagedProduct" ADD CONSTRAINT "PlantDamagedProduct_plantOrderItemId_fkey" FOREIGN KEY ("plantOrderItemId") REFERENCES "public"."PlantOrderItem"("orderItemId") ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "PurchaseOrder" ADD CONSTRAINT "PurchaseOrder_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "public"."Supplier"("supplierId") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "PurchaseOrder" ADD CONSTRAINT "PurchaseOrder_warehouseId_fkey" FOREIGN KEY ("warehouseId") REFERENCES "public"."Warehouse"("warehouseId") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "PurchaseOrderItems" ADD CONSTRAINT "PurchaseOrderItems_purchaseOrderId_fkey" FOREIGN KEY ("purchaseOrderId") REFERENCES "public"."PurchaseOrder"("id") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "PurchaseOrderItems" ADD CONSTRAINT "PurchaseOrderItems_plantId_fkey" FOREIGN KEY ("plantId") REFERENCES "public"."Plants"("plantId") ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "PurchaseOrderItems" ADD CONSTRAINT "PurchaseOrderItems_plantVariantId_fkey" FOREIGN KEY ("plantVariantId") REFERENCES "public"."PlantVariants"("variantId") ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "PurchaseOrderItems" ADD CONSTRAINT "PurchaseOrderItems_potCategoryId_fkey" FOREIGN KEY ("potCategoryId") REFERENCES "public"."PotCategory"("categoryId") ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "PurchaseOrderItems" ADD CONSTRAINT "PurchaseOrderItems_potVariantId_fkey" FOREIGN KEY ("potVariantId") REFERENCES "public"."PotVariants"("potVariantId") ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "PotDamagedProduct" ADD CONSTRAINT "PotDamagedProduct_potCategoryId_fkey" FOREIGN KEY ("potCategoryId") REFERENCES "public"."PotCategory"("categoryId") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "PotDamagedProduct" ADD CONSTRAINT "PotDamagedProduct_potVariantId_fkey" FOREIGN KEY ("potVariantId") REFERENCES "public"."PotVariants"("potVariantId") ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "PotDamagedProduct" ADD CONSTRAINT "PotDamagedProduct_warehouseId_fkey" FOREIGN KEY ("warehouseId") REFERENCES "public"."Warehouse"("warehouseId") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "PotDamagedProduct" ADD CONSTRAINT "PotDamagedProduct_purchaseOrderId_fkey" FOREIGN KEY ("purchaseOrderId") REFERENCES "public"."PurchaseOrder"("id") ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "PotDamagedProduct" ADD CONSTRAINT "PotDamagedProduct_purchaseOrderItemId_fkey" FOREIGN KEY ("purchaseOrderItemId") REFERENCES "public"."PurchaseOrderItems"("id") ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "PotDamagedProduct" ADD CONSTRAINT "PotDamagedProduct_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "public"."Order"("orderId") ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "PotDamagedProduct" ADD CONSTRAINT "PotDamagedProduct_potOrderItemId_fkey" FOREIGN KEY ("potOrderItemId") REFERENCES "public"."PotOrderItem"("orderItemId") ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "Review" ADD CONSTRAINT "Review_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "public"."Customer"("customerId") ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "Review" ADD CONSTRAINT "Review_plantId_fkey" FOREIGN KEY ("plantId") REFERENCES "public"."Plants"("plantId") ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "Review" ADD CONSTRAINT "Review_plantVariantId_fkey" FOREIGN KEY ("plantVariantId") REFERENCES "public"."PlantVariants"("variantId") ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "Review" ADD CONSTRAINT "Review_potCategoryId_fkey" FOREIGN KEY ("potCategoryId") REFERENCES "public"."PotCategory"("categoryId") ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "Review" ADD CONSTRAINT "Review_potVariantId_fkey" FOREIGN KEY ("potVariantId") REFERENCES "public"."PotVariants"("potVariantId") ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "ReviewImage" ADD CONSTRAINT "ReviewImage_reviewId_fkey" FOREIGN KEY ("reviewId") REFERENCES "public"."Review"("reviewId") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "WebsiteAnalytics" ADD CONSTRAINT "WebsiteAnalytics_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "public"."Customer"("customerId") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "PlantSalesAnalytics" ADD CONSTRAINT "PlantSalesAnalytics_plantId_fkey" FOREIGN KEY ("plantId") REFERENCES "public"."Plants"("plantId") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "PlantSalesAnalytics" ADD CONSTRAINT "PlantSalesAnalytics_plantVariantId_fkey" FOREIGN KEY ("plantVariantId") REFERENCES "public"."PlantVariants"("variantId") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "PotSalesAnalytics" ADD CONSTRAINT "PotSalesAnalytics_potCategoryId_fkey" FOREIGN KEY ("potCategoryId") REFERENCES "public"."PotCategory"("categoryId") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "PotSalesAnalytics" ADD CONSTRAINT "PotSalesAnalytics_potVariantId_fkey" FOREIGN KEY ("potVariantId") REFERENCES "public"."PotVariants"("potVariantId") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "PlantWarehouseInventory" ADD CONSTRAINT "PlantWarehouseInventory_plantId_fkey" FOREIGN KEY ("plantId") REFERENCES "public"."Plants"("plantId") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "PlantWarehouseInventory" ADD CONSTRAINT "PlantWarehouseInventory_warehouseId_fkey" FOREIGN KEY ("warehouseId") REFERENCES "public"."Warehouse"("warehouseId") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "PlantWarehouseInventory" ADD CONSTRAINT "PlantWarehouseInventory_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "public"."PlantVariants"("variantId") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "PotWarehouseInventory" ADD CONSTRAINT "PotWarehouseInventory_potVariantId_fkey" FOREIGN KEY ("potVariantId") REFERENCES "public"."PotVariants"("potVariantId") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "PotWarehouseInventory" ADD CONSTRAINT "PotWarehouseInventory_potCategoryId_fkey" FOREIGN KEY ("potCategoryId") REFERENCES "public"."PotCategory"("categoryId") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "PotWarehouseInventory" ADD CONSTRAINT "PotWarehouseInventory_warehouseId_fkey" FOREIGN KEY ("warehouseId") REFERENCES "public"."Warehouse"("warehouseId") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "PlantRestockEventLog" ADD CONSTRAINT "PlantRestockEventLog_plantId_fkey" FOREIGN KEY ("plantId") REFERENCES "public"."Plants"("plantId") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "PlantRestockEventLog" ADD CONSTRAINT "PlantRestockEventLog_plantVariantId_fkey" FOREIGN KEY ("plantVariantId") REFERENCES "public"."PlantVariants"("variantId") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "PlantRestockEventLog" ADD CONSTRAINT "PlantRestockEventLog_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "public"."Supplier"("supplierId") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "PlantRestockEventLog" ADD CONSTRAINT "PlantRestockEventLog_warehouseId_fkey" FOREIGN KEY ("warehouseId") REFERENCES "public"."Warehouse"("warehouseId") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "PlantRestockEventLog" ADD CONSTRAINT "PlantRestockEventLog_purchaseOrderId_fkey" FOREIGN KEY ("purchaseOrderId") REFERENCES "public"."PurchaseOrder"("id") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "PotRestockEventLog" ADD CONSTRAINT "PotRestockEventLog_potVariantId_fkey" FOREIGN KEY ("potVariantId") REFERENCES "public"."PotVariants"("potVariantId") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "PotRestockEventLog" ADD CONSTRAINT "PotRestockEventLog_potCategoryId_fkey" FOREIGN KEY ("potCategoryId") REFERENCES "public"."PotCategory"("categoryId") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "PotRestockEventLog" ADD CONSTRAINT "PotRestockEventLog_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "public"."Supplier"("supplierId") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "PotRestockEventLog" ADD CONSTRAINT "PotRestockEventLog_warehouseId_fkey" FOREIGN KEY ("warehouseId") REFERENCES "public"."Warehouse"("warehouseId") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "PotRestockEventLog" ADD CONSTRAINT "PotRestockEventLog_purchaseOrderId_fkey" FOREIGN KEY ("purchaseOrderId") REFERENCES "public"."PurchaseOrder"("id") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "WarehouseCartItem" ADD CONSTRAINT "WarehouseCartItem_warehouseId_fkey" FOREIGN KEY ("warehouseId") REFERENCES "public"."Warehouse"("warehouseId") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "WarehouseCartItem" ADD CONSTRAINT "WarehouseCartItem_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "public"."Supplier"("supplierId") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "WarehouseCartItem" ADD CONSTRAINT "WarehouseCartItem_plantId_fkey" FOREIGN KEY ("plantId") REFERENCES "public"."Plants"("plantId") ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "WarehouseCartItem" ADD CONSTRAINT "WarehouseCartItem_plantVariantId_fkey" FOREIGN KEY ("plantVariantId") REFERENCES "public"."PlantVariants"("variantId") ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "WarehouseCartItem" ADD CONSTRAINT "WarehouseCartItem_potCategoryId_fkey" FOREIGN KEY ("potCategoryId") REFERENCES "public"."PotCategory"("categoryId") ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "WarehouseCartItem" ADD CONSTRAINT "WarehouseCartItem_potVariantId_fkey" FOREIGN KEY ("potVariantId") REFERENCES "public"."PotVariants"("potVariantId") ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "PurchaseOrderPayment" ADD CONSTRAINT "PurchaseOrderPayment_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "public"."PurchaseOrder"("id") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "PurchaseOrderMedia" ADD CONSTRAINT "PurchaseOrderMedia_purchaseOrderId_fkey" FOREIGN KEY ("purchaseOrderId") REFERENCES "public"."PurchaseOrder"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "PlantSupplierInventory" ADD CONSTRAINT "PlantSupplierInventory_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "public"."Supplier"("supplierId") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "PlantSupplierInventory" ADD CONSTRAINT "PlantSupplierInventory_plantId_fkey" FOREIGN KEY ("plantId") REFERENCES "public"."Plants"("plantId") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "PlantSupplierInventory" ADD CONSTRAINT "PlantSupplierInventory_plantVariantId_fkey" FOREIGN KEY ("plantVariantId") REFERENCES "public"."PlantVariants"("variantId") ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "PotSupplierInventory" ADD CONSTRAINT "PotSupplierInventory_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "public"."Supplier"("supplierId") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "PotSupplierInventory" ADD CONSTRAINT "PotSupplierInventory_potCategoryId_fkey" FOREIGN KEY ("potCategoryId") REFERENCES "public"."PotCategory"("categoryId") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "PotSupplierInventory" ADD CONSTRAINT "PotSupplierInventory_potVariantId_fkey" FOREIGN KEY ("potVariantId") REFERENCES "public"."PotVariants"("potVariantId") ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "EmailVerification" ADD CONSTRAINT "EmailVerification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("userId") ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "PhoneVerification" ADD CONSTRAINT "PhoneVerification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("userId") ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("userId") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "PotVariants" ADD CONSTRAINT "PotVariants_colorId_fkey" FOREIGN KEY ("colorId") REFERENCES "public"."Color"("id") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "PotVariants" ADD CONSTRAINT "PotVariants_sizeMaterialOptionId_fkey" FOREIGN KEY ("sizeMaterialOptionId") REFERENCES "public"."SizeMaterialOption"("sizeMaterialOptionId") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "PotSizeProfile" ADD CONSTRAINT "PotSizeProfile_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "public"."PotCategory"("categoryId") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "SizeMaterialOption" ADD CONSTRAINT "SizeMaterialOption_potSizeProfileId_fkey" FOREIGN KEY ("potSizeProfileId") REFERENCES "public"."PotSizeProfile"("potSizeProfileId") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "SizeMaterialOption" ADD CONSTRAINT "SizeMaterialOption_materialId_fkey" FOREIGN KEY ("materialId") REFERENCES "public"."PotMaterial"("materialId") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "_ProductCategories" ADD CONSTRAINT "_ProductCategories_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."PlantCategory"("categoryId") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "_ProductCategories" ADD CONSTRAINT "_ProductCategories_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."Plants"("plantId") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "_CompatiblePots" ADD CONSTRAINT "_CompatiblePots_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."PlantSizeProfile"("plantSizeId") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "_CompatiblePots" ADD CONSTRAINT "_CompatiblePots_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."PotVariants"("potVariantId") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "_PlantVariantToTags" ADD CONSTRAINT "_PlantVariantToTags_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."PlantVariants"("variantId") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "_PlantVariantToTags" ADD CONSTRAINT "_PlantVariantToTags_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."Tags"("tagId") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "_PotVariantToTags" ADD CONSTRAINT "_PotVariantToTags_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."PotVariants"("potVariantId") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "_PotVariantToTags" ADD CONSTRAINT "_PotVariantToTags_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."Tags"("tagId") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "RolePermission" ADD CONSTRAINT "RolePermission_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "public"."Role"("roleId") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "RolePermission" ADD CONSTRAINT "RolePermission_permissionId_fkey" FOREIGN KEY ("permissionId") REFERENCES "public"."Permission"("permissionId") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "RolePermission" ADD CONSTRAINT "RolePermission_addedByUserId_fkey" FOREIGN KEY ("addedByUserId") REFERENCES "public"."User"("userId") ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "UserGroup" ADD CONSTRAINT "UserGroup_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("userId") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "UserGroup" ADD CONSTRAINT "UserGroup_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "public"."Group"("groupId") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "GroupRole" ADD CONSTRAINT "GroupRole_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "public"."Group"("groupId") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "GroupRole" ADD CONSTRAINT "GroupRole_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "public"."Role"("roleId") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "UserPermission" ADD CONSTRAINT "UserPermission_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("userId") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "UserPermission" ADD CONSTRAINT "UserPermission_permissionId_fkey" FOREIGN KEY ("permissionId") REFERENCES "public"."Permission"("permissionId") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "UserPermission" ADD CONSTRAINT "UserPermission_addedByUserId_fkey" FOREIGN KEY ("addedByUserId") REFERENCES "public"."User"("userId") ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
CREATE UNIQUE INDEX "DeliveryCharge_pinCode_size_key" ON "DeliveryCharge" USING btree ("pinCode" text_ops,"size" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "SerialTracker_entityCode_year_key" ON "SerialTracker" USING btree ("entityCode" int4_ops,"year" int4_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "Role_role_key" ON "Role" USING btree ("role" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "User_email_key" ON "User" USING btree ("email" text_ops);--> statement-breakpoint
CREATE INDEX "User_phoneNumber_email_idx" ON "User" USING btree ("phoneNumber" text_ops,"email" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "User_phoneNumber_key" ON "User" USING btree ("phoneNumber" text_ops);--> statement-breakpoint
CREATE INDEX "User_userId_idx" ON "User" USING btree ("userId" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "Action_name_key" ON "Action" USING btree ("name" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "Module_name_key" ON "Module" USING btree ("name" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "Resource_name_moduleId_key" ON "Resource" USING btree ("name" text_ops,"moduleId" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "Permission_actionId_resourceId_moduleId_key" ON "Permission" USING btree ("actionId" text_ops,"resourceId" text_ops,"moduleId" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "GroupPermission_groupId_actionId_resourceId_moduleId_key" ON "GroupPermission" USING btree ("groupId" text_ops,"actionId" text_ops,"resourceId" text_ops,"moduleId" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "Customer_userId_key" ON "Customer" USING btree ("userId" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "Admin_userId_key" ON "Admin" USING btree ("userId" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "SuperAdmin_userId_key" ON "SuperAdmin" USING btree ("userId" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "Employee_userId_key" ON "Employee" USING btree ("userId" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "Supplier_userId_key" ON "Supplier" USING btree ("userId" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "Supplier_userId_warehouseId_key" ON "Supplier" USING btree ("userId" text_ops,"warehouseId" text_ops);--> statement-breakpoint
CREATE INDEX "NurseryMediaAsset_supplierId_idx" ON "NurseryMediaAsset" USING btree ("supplierId" text_ops);--> statement-breakpoint
CREATE INDEX "NotifyMeSubscription_customerId_idx" ON "NotifyMeSubscription" USING btree ("customerId" text_ops);--> statement-breakpoint
CREATE INDEX "NotifyMeSubscription_notified_idx" ON "NotifyMeSubscription" USING btree ("notified" bool_ops);--> statement-breakpoint
CREATE INDEX "NotifyMeSubscription_plantVariantId_idx" ON "NotifyMeSubscription" USING btree ("plantVariantId" text_ops);--> statement-breakpoint
CREATE INDEX "NotifyMeSubscription_potVariantId_idx" ON "NotifyMeSubscription" USING btree ("potVariantId" text_ops);--> statement-breakpoint
CREATE INDEX "Plants_isFeatured_idx" ON "Plants" USING btree ("isFeatured" bool_ops);--> statement-breakpoint
CREATE INDEX "Plants_isProductActive_idx" ON "Plants" USING btree ("isProductActive" bool_ops);--> statement-breakpoint
CREATE INDEX "Plants_name_idx" ON "Plants" USING btree ("name" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "PlantVariants_sku_key" ON "PlantVariants" USING btree ("sku" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "PlantCartItem_customerId_plantId_plantVariantId_key" ON "PlantCartItem" USING btree ("customerId" text_ops,"plantId" text_ops,"plantVariantId" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "PromoCode_code_key" ON "PromoCode" USING btree ("code" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "PotCartItem_customerId_potCategoryId_potVariantId_key" ON "PotCartItem" USING btree ("customerId" text_ops,"potCategoryId" text_ops,"potVariantId" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "PlantCheckoutLater_customerId_plantId_plantVariantId_key" ON "PlantCheckoutLater" USING btree ("customerId" bpchar_ops,"plantId" bpchar_ops,"plantVariantId" bpchar_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "PotCheckoutLater_customerId_potCategoryId_potVariantId_key" ON "PotCheckoutLater" USING btree ("customerId" bpchar_ops,"potCategoryId" bpchar_ops,"potVariantId" bpchar_ops);--> statement-breakpoint
CREATE INDEX "PotVariantImage_potVariantId_idx" ON "PotVariantImage" USING btree ("potVariantId" text_ops);--> statement-breakpoint
CREATE INDEX "PlantVariantImage_plantVariantId_idx" ON "PlantVariantImage" USING btree ("plantVariantId" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "PlantSizeProfile_plantId_plantSize_key" ON "PlantSizeProfile" USING btree ("plantId" text_ops,"plantSize" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "Color_name_key" ON "Color" USING btree ("name" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "PlantCareGuidelines_plantSizeId_season_key" ON "PlantCareGuidelines" USING btree ("plantSizeId" text_ops,"season" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "PlantFertilizerSchedule_plantSizeId_fertilizerId_applicatio_key" ON "PlantFertilizerSchedule" USING btree ("plantSizeId" text_ops,"fertilizerId" text_ops,"applicationSeason" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "PlantSizeCostComponent_genericCostComponentId_plantSize_key" ON "PlantSizeCostComponent" USING btree ("genericCostComponentId" text_ops,"plantSize" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "PotSizeCostComponent_genericCostComponentId_potSize_key" ON "PotSizeCostComponent" USING btree ("genericCostComponentId" text_ops,"potSize" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "PotMaterial_name_key" ON "PotMaterial" USING btree ("name" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "Order_invoiceNumber_key" ON "Order" USING btree ("invoiceNumber" text_ops);--> statement-breakpoint
CREATE INDEX "PlantOrderItem_orderId_idx" ON "PlantOrderItem" USING btree ("orderId" text_ops);--> statement-breakpoint
CREATE INDEX "PotOrderItem_orderId_idx" ON "PotOrderItem" USING btree ("orderId" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "OrderCostDetails_orderId_key" ON "OrderCostDetails" USING btree ("orderId" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "Shipping_orderId_key" ON "Shipping" USING btree ("orderId" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "ReturnsRefunds_exchangeShippingId_key" ON "ReturnsRefunds" USING btree ("exchangeShippingId" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "ReferralCode_referralCode_key" ON "ReferralCode" USING btree ("referralCode" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "ReferralCode_referrerCustomerId_key" ON "ReferralCode" USING btree ("referrerCustomerId" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "ReferralUsage_referralId_referredCustomerId_key" ON "ReferralUsage" USING btree ("referralId" text_ops,"referredCustomerId" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "PlantDamagedProduct_plantOrderItemId_key" ON "PlantDamagedProduct" USING btree ("plantOrderItemId" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "PlantDamagedProduct_purchaseOrderItemId_key" ON "PlantDamagedProduct" USING btree ("purchaseOrderItemId" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "PotDamagedProduct_potOrderItemId_key" ON "PotDamagedProduct" USING btree ("potOrderItemId" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "PotDamagedProduct_purchaseOrderItemId_key" ON "PotDamagedProduct" USING btree ("purchaseOrderItemId" text_ops);--> statement-breakpoint
CREATE INDEX "ReviewImage_reviewId_idx" ON "ReviewImage" USING btree ("reviewId" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "PlantWarehouseInventory_plantId_variantId_warehouseId_key" ON "PlantWarehouseInventory" USING btree ("plantId" text_ops,"variantId" text_ops,"warehouseId" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "PotWarehouseInventory_potCategoryId_potVariantId_warehouseI_key" ON "PotWarehouseInventory" USING btree ("potCategoryId" text_ops,"potVariantId" text_ops,"warehouseId" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "WarehouseCartItem_warehouseId_supplierId_plantId_plantVaria_key" ON "WarehouseCartItem" USING btree ("warehouseId" text_ops,"supplierId" text_ops,"plantId" text_ops,"plantVariantId" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "WarehouseCartItem_warehouseId_supplierId_potCategoryId_potV_key" ON "WarehouseCartItem" USING btree ("warehouseId" text_ops,"supplierId" text_ops,"potCategoryId" text_ops,"potVariantId" text_ops);--> statement-breakpoint
CREATE INDEX "PurchaseOrderMedia_purchaseOrderId_idx" ON "PurchaseOrderMedia" USING btree ("purchaseOrderId" text_ops);--> statement-breakpoint
CREATE INDEX "EmailVerification_email_idx" ON "EmailVerification" USING btree ("email" text_ops);--> statement-breakpoint
CREATE INDEX "EmailVerification_userId_idx" ON "EmailVerification" USING btree ("userId" text_ops);--> statement-breakpoint
CREATE INDEX "PhoneVerification_phoneNumber_idx" ON "PhoneVerification" USING btree ("phoneNumber" text_ops);--> statement-breakpoint
CREATE INDEX "PhoneVerification_userId_idx" ON "PhoneVerification" USING btree ("userId" text_ops);--> statement-breakpoint
CREATE INDEX "Notification_category_idx" ON "Notification" USING btree ("category" enum_ops);--> statement-breakpoint
CREATE INDEX "Notification_userId_createdAt_idx" ON "Notification" USING btree ("userId" timestamp_ops,"createdAt" text_ops);--> statement-breakpoint
CREATE INDEX "Notification_userId_isRead_idx" ON "Notification" USING btree ("userId" text_ops,"isRead" bool_ops);--> statement-breakpoint
CREATE INDEX "PotVariants_colorId_idx" ON "PotVariants" USING btree ("colorId" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "PotVariants_sizeMaterialOptionId_colorId_key" ON "PotVariants" USING btree ("sizeMaterialOptionId" text_ops,"colorId" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "PotVariants_sku_key" ON "PotVariants" USING btree ("sku" text_ops);--> statement-breakpoint
CREATE INDEX "PotSizeProfile_categoryId_idx" ON "PotSizeProfile" USING btree ("categoryId" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "PotSizeProfile_categoryId_size_key" ON "PotSizeProfile" USING btree ("categoryId" text_ops,"size" text_ops);--> statement-breakpoint
CREATE INDEX "PotSizeProfile_size_idx" ON "PotSizeProfile" USING btree ("size" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "SizeMaterialOption_potSizeProfileId_materialId_key" ON "SizeMaterialOption" USING btree ("potSizeProfileId" text_ops,"materialId" text_ops);--> statement-breakpoint
CREATE INDEX "_ProductCategories_B_index" ON "_ProductCategories" USING btree ("B" text_ops);--> statement-breakpoint
CREATE INDEX "_CompatiblePots_B_index" ON "_CompatiblePots" USING btree ("B" text_ops);--> statement-breakpoint
CREATE INDEX "_PlantVariantToTags_B_index" ON "_PlantVariantToTags" USING btree ("B" text_ops);--> statement-breakpoint
CREATE INDEX "_PotVariantToTags_B_index" ON "_PotVariantToTags" USING btree ("B" text_ops);--> statement-breakpoint
CREATE INDEX "UserGroup_groupId_idx" ON "UserGroup" USING btree ("groupId" text_ops);
*/