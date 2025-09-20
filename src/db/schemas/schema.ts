// @ts-nocheck
import { sql } from "drizzle-orm";
import { boolean, foreignKey, index, integer, jsonb, numeric, pgEnum, pgTable, primaryKey, serial, text, timestamp, uniqueIndex, uuid, varchar } from "drizzle-orm/pg-core";
import { colorTable } from "./color.schema";
import { FertilizerTable } from "./fertilizers.schema";
import { userTable } from "./user.schema";
export const addedByType = pgEnum("AddedByType", ['SYSTEM', 'ADMIN', 'SUPERADMIN'])
export const auditAction = pgEnum("AuditAction", ['ADDED', 'REVOKED', 'MODIFIED'])
export const damageType = pgEnum("DamageType", ['USER_DELIVERY', 'SUPPLIER_DELIVERY', 'WAREHOUSE_IN_HOUSE'])
export const notificationCategory = pgEnum("NotificationCategory", ['GENERAL', 'ORDER', 'PROMOTION', 'ALERT', 'REMINDER', 'SYSTEM', 'SECURITY'])
export const orderStatus = pgEnum("OrderStatus", ['APPROVED', 'PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'RETURNED', 'PROCESSING', 'REJECTED', 'UNDER_REVIEW'])
export const paymentMethod = pgEnum("PaymentMethod", ['CASH', 'ONLINE', 'UPI', 'NEFT', 'BANK_TRANSFER'])
export const size = pgEnum("Size", ['EXTRA_SMALL', 'SMALL', 'MEDIUM', 'LARGE', 'EXTRA_LARGE'])


export const prismaMigrations = pgTable("_prisma_migrations", {
	id: varchar({ length: 36 }).primaryKey().notNull(),
	checksum: varchar({ length: 64 }).notNull(),
	finishedAt: timestamp("finished_at", { withTimezone: true, mode: 'string' }),
	migrationName: varchar("migration_name", { length: 255 }).notNull(),
	logs: text(),
	rolledBackAt: timestamp("rolled_back_at", { withTimezone: true, mode: 'string' }),
	startedAt: timestamp("started_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	appliedStepsCount: integer("applied_steps_count").default(0).notNull(),
});



export const plants = pgTable("Plants", {
	plantId: text().primaryKey().notNull(),
	name: text().notNull(),
	scientificName: text(),
	description: text().notNull(),
	isProductActive: boolean().default(true).notNull(),
	isFeatured: boolean().notNull(),
	plantClass: text(),
	plantSeries: text(),
	placeOfOrigin: text(),
	auraType: text(),
	biodiversityBooster: boolean(),
	carbonAbsorber: boolean(),
	minimumTemperature: integer(),
	maximumTemperature: integer(),
	soil: text(),
	repotting: text(),
	maintenance: text(),
	insideBox: text().array().default(["RAY"]),
	benefits: text().array().default(["RAY"]),
	spiritualUseCase: text().array().default(["RAY"]),
	bestForEmotion: text().array().default(["RAY"]),
	bestGiftFor: text().array().default(["RAY"]),
	funFacts: text().array().default(["RAY"]),
	associatedDeity: text().array().default(["RAY"]),
	godAligned: text().array().default(["RAY"]),
	createdAt: timestamp({ precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp({ precision: 3, mode: 'string' }).notNull(),
	deletedAt: timestamp({ precision: 3, mode: 'string' }),
}, (table) => [
	index("Plants_isFeatured_idx").using("btree", table.isFeatured.asc().nullsLast().op("bool_ops")),
	index("Plants_isProductActive_idx").using("btree", table.isProductActive.asc().nullsLast().op("bool_ops")),
	index("Plants_name_idx").using("btree", table.name.asc().nullsLast().op("text_ops")),
]);

export const plantVariants = pgTable("plant_variants", {
	variantId: text().primaryKey().notNull(),
	plantId: text().notNull(),
	plantSizeId: text().notNull(),
	colorId: uuid().notNull(),
	sku: text().notNull(),
	isProductActive: boolean().default(true).notNull(),
	mrp: numeric({ precision: 65, scale: 30 }).default('0.0').notNull(),
	notes: text(),
	createdAt: timestamp({ precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp({ precision: 3, mode: 'string' }).notNull(),
	deletedAt: timestamp({ precision: 3, mode: 'string' }),
}, (table) => [
	uniqueIndex("PlantVariants_sku_key").using("btree", table.sku.asc().nullsLast().op("text_ops")),
	foreignKey({
		columns: [table.plantId],
		foreignColumns: [plants.plantId],
		name: "PlantVariants_plantId_fkey"
	}).onUpdate("cascade").onDelete("restrict"),
	foreignKey({
		columns: [table.colorId],
		foreignColumns: [colorTable.id],
		name: "PlantVariants_colorId_fkey"
	}).onUpdate("cascade").onDelete("restrict"),
	foreignKey({
		columns: [table.plantSizeId],
		foreignColumns: [plantSizeProfile.plantSizeId],
		name: "PlantVariants_plantSizeId_fkey"
	}).onUpdate("cascade").onDelete("restrict"),
]);

export const potCategory = pgTable("PotCategory", {
	categoryId: text().primaryKey().notNull(),
	name: text().notNull(),
	description: text(),
	publicId: text(),
	mediaUrl: text(),
	createdAt: timestamp({ precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp({ precision: 3, mode: 'string' }).notNull(),
	deletedAt: timestamp({ precision: 3, mode: 'string' }),
});


export const serialTracker = pgTable(
	"SerialTracker",
	{
		id: serial("id").primaryKey().notNull(),
		entityCode: text("entityCode").notNull(),
		year: integer("year").notNull(),
		lastSerial: integer("lastSerial").default(0).notNull(),
		createdAt: timestamp({ precision: 3, mode: "string" })
			.default(sql`CURRENT_TIMESTAMP`)
			.notNull(),
		updatedAt: timestamp({ precision: 3, mode: "string" }).notNull(),
	},
	(table) => [
		uniqueIndex("SerialTracker_entityCode_year_key", [
			table.entityCode.asc().nullsLast(),
			table.year.asc().nullsLast(),
		]),
	]
);

export const warehouse = pgTable("Warehouse", {
	warehouseId: text().primaryKey().notNull(),
	name: text().notNull(),
	capacityUnits: integer(),
	officeEmail: text(),
	officePhone: text(),
	officeAddress: jsonb(),
	createdAt: timestamp({ precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp({ precision: 3, mode: 'string' }).notNull(),
});


export const potVariantImage = pgTable("PotVariantImage", {
	id: text().primaryKey().notNull(),
	potVariantId: text().notNull(),
	publicId: text().notNull(),
	mediaUrl: text().notNull(),
	mediaType: text(),
	resourceType: text(),
	isPrimary: boolean().default(false).notNull(),
	createdAt: timestamp({ precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp({ precision: 3, mode: 'string' }).notNull(),
	deletedAt: timestamp({ precision: 3, mode: 'string' }),
}, (table) => [
	index("PotVariantImage_potVariantId_idx").using("btree", table.potVariantId.asc().nullsLast().op("text_ops")),
	foreignKey({
		columns: [table.potVariantId],
		foreignColumns: [potVariants.potVariantId],
		name: "PotVariantImage_potVariantId_fkey"
	}).onUpdate("cascade").onDelete("cascade"),
]);

export const plantVariantImage = pgTable("PlantVariantImage", {
	id: text().primaryKey().notNull(),
	plantVariantId: text().notNull(),
	mediaUrl: text().notNull(),
	publicId: text().notNull(),
	mediaType: text(),
	resourceType: text(),
	isPrimary: boolean().default(false).notNull(),
	createdAt: timestamp({ precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp({ precision: 3, mode: 'string' }).notNull(),
	deletedAt: timestamp({ precision: 3, mode: 'string' }),
}, (table) => [
	index("PlantVariantImage_plantVariantId_idx").using("btree", table.plantVariantId.asc().nullsLast().op("text_ops")),
	foreignKey({
		columns: [table.plantVariantId],
		foreignColumns: [plantVariants.variantId],
		name: "PlantVariantImage_plantVariantId_fkey"
	}).onUpdate("cascade").onDelete("cascade"),
]);

export const plantSizeProfile = pgTable(
	"PlantSizeProfile",
	{
		plantSizeId: text("plantSizeId").primaryKey().notNull(),
		plantId: text("plantId").notNull(),
		plantSize: text("plantSize").notNull(), // changed `size()` → `text()` since Drizzle has no size type
		height: numeric("height", { precision: 65, scale: 30 }).notNull(),
		weight: numeric("weight", { precision: 65, scale: 30 }).notNull(),
	},
	(table) => [
		uniqueIndex("PlantSizeProfile_plantId_plantSize_key", [
			table.plantId.asc().nullsLast(),
			table.plantSize.asc().nullsLast(),
		]),
		foreignKey({
			columns: [table.plantId],
			foreignColumns: [plants.plantId],
			name: "PlantSizeProfile_plantId_fkey",
			onUpdate: "cascade",
			onDelete: "restrict",
		}),
	]
);

export const plantCareGuidelines = pgTable("PlantCareGuidelines", {
	plantCareId: text().primaryKey().notNull(),
	plantSizeId: text().notNull(),
	sunlightTypeId: text().notNull(),
	humidityLevelId: text().notNull(),
	season: text().notNull(),
	wateringFrequency: text().notNull(),
	waterAmountMl: numeric({ precision: 65, scale: 30 }).notNull(),
	wateringMethod: text().notNull(),
	recommendedTime: text().notNull(),
	soilTypes: text().notNull(),
	preferredSeasons: text().notNull(),
	careNotes: text(),
	createdAt: timestamp({ precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp({ precision: 3, mode: 'string' }).notNull(),
	deletedAt: timestamp({ precision: 3, mode: 'string' }),
}, (table) => [
	uniqueIndex("PlantCareGuidelines_plantSizeId_season_key").using("btree", table.plantSizeId.asc().nullsLast().op("text_ops"), table.season.asc().nullsLast().op("text_ops")),
	foreignKey({
		columns: [table.plantSizeId],
		foreignColumns: [plantSizeProfile.plantSizeId],
		name: "PlantCareGuidelines_plantSizeId_fkey"
	}).onUpdate("cascade").onDelete("restrict"),
	foreignKey({
		columns: [table.sunlightTypeId],
		foreignColumns: [sunlightTypes.sunlightId],
		name: "PlantCareGuidelines_sunlightTypeId_fkey"
	}).onUpdate("cascade").onDelete("restrict"),
	foreignKey({
		columns: [table.humidityLevelId],
		foreignColumns: [humidityLevel.humidityId],
		name: "PlantCareGuidelines_humidityLevelId_fkey"
	}).onUpdate("cascade").onDelete("restrict"),
]);

export const sunlightTypes = pgTable("SunlightTypes", {
	sunlightId: text().primaryKey().notNull(),
	typeName: text().notNull(),
	mediaUrl: text().notNull(),
	publicId: text().notNull(),
	description: text(),
	createdAt: timestamp({ precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp({ precision: 3, mode: 'string' }).notNull(),
	deletedAt: timestamp({ precision: 3, mode: 'string' }),
});

export const humidityLevel = pgTable("HumidityLevel", {
	humidityId: text().primaryKey().notNull(),
	level: text().notNull(),
	description: text(),
	suitableZones: text(),
	createdAt: timestamp({ precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp({ precision: 3, mode: 'string' }).notNull(),
	deletedAt: timestamp({ precision: 3, mode: 'string' }),
});

export const plantFertilizerSchedule = pgTable("PlantFertilizerSchedule", {
  fertilizerScheduleId: text().primaryKey().notNull(),
  plantSizeId: text().notNull(),
  fertilizerId: integer().notNull(),
  applicationFrequency: text().notNull(),
  applicationMethod: text().array().default(["RAY"]),
  applicationSeason: text().notNull(),
  applicationTime: text().notNull(),
  benefits: text().array().default(["RAY"]),
  dosageAmount: numeric({ precision: 65, scale: 30 }).notNull(),
  safetyNotes: text().array().default(["RAY"]),
  createdAt: timestamp({ precision: 3, mode: "string" })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp({ precision: 3, mode: "string" }).notNull(),
  deletedAt: timestamp({ precision: 3, mode: "string" }),
}, (table) => [
  uniqueIndex(
    "PlantFertilizerSchedule_plantSizeId_fertilizerId_applicatio_key"
  ).using(
    "btree",
    table.plantSizeId.asc().nullsLast().op("text_ops"),
    table.fertilizerId.asc().nullsLast().op("int4_ops"), // 🔑 integer ops
    table.applicationSeason.asc().nullsLast().op("text_ops"),
  ),
  foreignKey({
    columns: [table.plantSizeId],
    foreignColumns: [plantSizeProfile.plantSizeId],
    name: "PlantFertilizerSchedule_plantSizeId_fkey",
  }).onUpdate("cascade").onDelete("restrict"),
  foreignKey({
    columns: [table.fertilizerId],
    foreignColumns: [FertilizerTable.id],
    name: "PlantFertilizerSchedule_fertilizerId_fkey",
  }).onUpdate("cascade").onDelete("restrict"),
]);


export const potMaterial = pgTable("PotMaterial", {
	materialId: text().primaryKey().notNull(),
	name: text().notNull(),
	description: text().notNull(),
	createdAt: timestamp({ precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp({ precision: 3, mode: 'string' }).notNull(),
	deletedAt: timestamp({ precision: 3, mode: 'string' }),
}, (table) => [
	uniqueIndex("PotMaterial_name_key").using("btree", table.name.asc().nullsLast().op("text_ops")),
]);

export const tagGroups = pgTable("TagGroups", {
	groupId: text().primaryKey().notNull(),
	groupName: text().notNull(),
	groupDescription: text(),
	createdAt: timestamp({ precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp({ precision: 3, mode: 'string' }).notNull(),
	deletedAt: timestamp({ precision: 3, mode: 'string' }),
});

export const tags = pgTable("Tags", {
	tagId: text().primaryKey().notNull(),
	groupId: text().notNull(),
	tagName: text().notNull(),
	tagDesc: text().notNull(),
	tagIcon: text(),
	createdAt: timestamp({ precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp({ precision: 3, mode: 'string' }).notNull(),
	deletedAt: timestamp({ precision: 3, mode: 'string' }),
}, (table) => [
	foreignKey({
		columns: [table.groupId],
		foreignColumns: [tagGroups.groupId],
		name: "Tags_groupId_fkey"
	}).onUpdate("cascade").onDelete("restrict"),
]);


export const notification = pgTable(
	"Notification",
	{
		id: text("id").primaryKey().notNull(),
		userId: text("userId").notNull(),
		title: text("title").notNull(),
		body: text("body").notNull(),
		category: notificationCategory("category").default("GENERAL").notNull(),
		isRead: boolean("isRead").default(false).notNull(),
		actionUrl: text("actionUrl"),
		createdAt: timestamp({ precision: 3, mode: "string" })
			.default(sql`CURRENT_TIMESTAMP`)
			.notNull(),
		updatedAt: timestamp({ precision: 3, mode: "string" }).notNull(),
	},
	(table) => [
		index("Notification_category_idx", [table.category.asc().nullsLast()]),
		index("Notification_userId_createdAt_idx", [
			table.userId.asc().nullsLast(),
			table.createdAt.asc().nullsLast(),
		]),
		index("Notification_userId_isRead_idx", [
			table.userId.asc().nullsLast(),
			table.isRead.asc().nullsLast(),
		]),
		foreignKey({
			columns: [table.userId],
			foreignColumns: [userTable.userId],
			name: "Notification_userId_fkey",
			onUpdate: "cascade",
			onDelete: "restrict",
		}),
	]
);

export const potVariants = pgTable("PotVariants", {
	potVariantId: text().primaryKey().notNull(),
	colorId: uuid().notNull(),
	potName: text().notNull(),
	sku: text().notNull(),
	mrp: numeric({ precision: 65, scale: 30 }).default('0.0').notNull(),
	isEcoFriendly: boolean().default(false).notNull(),
	isPremium: boolean().default(false).notNull(),
	createdAt: timestamp({ precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp({ precision: 3, mode: 'string' }).notNull(),
	deletedAt: timestamp({ precision: 3, mode: 'string' }),
	sizeMaterialOptionId: text().notNull(),
}, (table) => [
	// ✅ Drop text_ops
	index("PotVariants_colorId_idx").using("btree", table.colorId.asc().nullsLast()),

	uniqueIndex("PotVariants_sizeMaterialOptionId_colorId_key").using(
		"btree",
		table.sizeMaterialOptionId.asc().nullsLast(),
		table.colorId.asc().nullsLast()
	),

	uniqueIndex("PotVariants_sku_key").using("btree", table.sku.asc().nullsLast()),

	foreignKey({
		columns: [table.colorId],
		foreignColumns: [colorTable.id],
		name: "PotVariants_colorId_fkey",
	}).onUpdate("cascade").onDelete("restrict"),

	foreignKey({
		columns: [table.sizeMaterialOptionId],
		foreignColumns: [sizeMaterialOption.sizeMaterialOptionId],
		name: "PotVariants_sizeMaterialOptionId_fkey",
	}).onUpdate("cascade").onDelete("restrict"),
]);


export const potSizeProfile = pgTable("PotSizeProfile", {
	potSizeProfileId: text().primaryKey().notNull(),
	categoryId: text().notNull(),
	size: text().notNull(),
	height: numeric({ precision: 65, scale: 30 }),
	weight: numeric({ precision: 65, scale: 30 }),
}, (table) => [
	index("PotSizeProfile_categoryId_idx").using("btree", table.categoryId.asc().nullsLast().op("text_ops")),
	uniqueIndex("PotSizeProfile_categoryId_size_key").using("btree", table.categoryId.asc().nullsLast().op("text_ops"), table.size.asc().nullsLast().op("text_ops")),
	index("PotSizeProfile_size_idx").using("btree", table.size.asc().nullsLast().op("text_ops")),
	foreignKey({
		columns: [table.categoryId],
		foreignColumns: [potCategory.categoryId],
		name: "PotSizeProfile_categoryId_fkey"
	}).onUpdate("cascade").onDelete("restrict"),
]);

export const sizeMaterialOption = pgTable("SizeMaterialOption", {
	sizeMaterialOptionId: text().primaryKey().notNull(),
	potSizeProfileId: text().notNull(),
	materialId: text().notNull(),
}, (table) => [
	uniqueIndex("SizeMaterialOption_potSizeProfileId_materialId_key").using("btree", table.potSizeProfileId.asc().nullsLast().op("text_ops"), table.materialId.asc().nullsLast().op("text_ops")),
	foreignKey({
		columns: [table.potSizeProfileId],
		foreignColumns: [potSizeProfile.potSizeProfileId],
		name: "SizeMaterialOption_potSizeProfileId_fkey"
	}).onUpdate("cascade").onDelete("restrict"),
	foreignKey({
		columns: [table.materialId],
		foreignColumns: [potMaterial.materialId],
		name: "SizeMaterialOption_materialId_fkey"
	}).onUpdate("cascade").onDelete("restrict"),
]);

// export const productCategories = pgTable("_ProductCategories", {
// 	a: text("A").notNull(),
// 	b: text("B").notNull(),
// }, (table) => [
// 	index().using("btree", table.b.asc().nullsLast().op("text_ops")),
// 	foreignKey({
// 		columns: [table.a],
// 		foreignColumns: [plantCategoryTable.id],
// 		name: "_ProductCategories_A_fkey"
// 	}).onUpdate("cascade").onDelete("cascade"),
// 	foreignKey({
// 		columns: [table.b],
// 		foreignColumns: [plants.plantId],
// 		name: "_ProductCategories_B_fkey"
// 	}).onUpdate("cascade").onDelete("cascade"),
// 	primaryKey({ columns: [table.a, table.b], name: "_ProductCategories_AB_pkey" }),
// ]);

export const compatiblePots = pgTable("_CompatiblePots", {
	a: text("A").notNull(),
	b: text("B").notNull(),
}, (table) => [
	index().using("btree", table.b.asc().nullsLast().op("text_ops")),
	foreignKey({
		columns: [table.a],
		foreignColumns: [plantSizeProfile.plantSizeId],
		name: "_CompatiblePots_A_fkey"
	}).onUpdate("cascade").onDelete("cascade"),
	foreignKey({
		columns: [table.b],
		foreignColumns: [potVariants.potVariantId],
		name: "_CompatiblePots_B_fkey"
	}).onUpdate("cascade").onDelete("cascade"),
	primaryKey({ columns: [table.a, table.b], name: "_CompatiblePots_AB_pkey" }),
]);

export const plantVariantToTags = pgTable("_PlantVariantToTags", {
	a: text("A").notNull(),
	b: text("B").notNull(),
}, (table) => [
	index().using("btree", table.b.asc().nullsLast().op("text_ops")),
	foreignKey({
		columns: [table.a],
		foreignColumns: [plantVariants.variantId],
		name: "_PlantVariantToTags_A_fkey"
	}).onUpdate("cascade").onDelete("cascade"),
	foreignKey({
		columns: [table.b],
		foreignColumns: [tags.tagId],
		name: "_PlantVariantToTags_B_fkey"
	}).onUpdate("cascade").onDelete("cascade"),
	primaryKey({ columns: [table.a, table.b], name: "_PlantVariantToTags_AB_pkey" }),
]);

export const potVariantToTags = pgTable("_PotVariantToTags", {
	a: text("A").notNull(),
	b: text("B").notNull(),
}, (table) => [
	index().using("btree", table.b.asc().nullsLast().op("text_ops")),
	foreignKey({
		columns: [table.a],
		foreignColumns: [potVariants.potVariantId],
		name: "_PotVariantToTags_A_fkey"
	}).onUpdate("cascade").onDelete("cascade"),
	foreignKey({
		columns: [table.b],
		foreignColumns: [tags.tagId],
		name: "_PotVariantToTags_B_fkey"
	}).onUpdate("cascade").onDelete("cascade"),
	primaryKey({ columns: [table.a, table.b], name: "_PotVariantToTags_AB_pkey" }),
]);


// export const userTable = pgTable("user", {
// 	userId: text().primaryKey().notNull(),
// 	// roleId: text().notNull(),
// 	fullName: text().notNull(),
// 	phoneNumber: text(),
// 	email: text().notNull(),
// 	password: text().notNull(),
// 	isActive: boolean().default(true).notNull(),
// 	profileImageUrl: text(),
// 	publicId: text(),
// 	phoneVerified: boolean().default(false).notNull(),
// 	emailVerified: boolean().default(false).notNull(),
// 	address: jsonb(),
// 	deactivationReason: text(),
// 	createdAt: timestamp({ precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
// 	updatedAt: timestamp({ precision: 3, mode: 'string' }).notNull(),
// 	deletedAt: timestamp({ precision: 3, mode: 'string' }),
// }, (table) => [
// 	uniqueIndex("User_email_key").using("btree", table.email.asc().nullsLast().op("text_ops")),
// 	index("User_phoneNumber_email_idx").using("btree", table.phoneNumber.asc().nullsLast().op("text_ops"), table.email.asc().nullsLast().op("text_ops")),
// 	uniqueIndex("User_phoneNumber_key").using("btree", table.phoneNumber.asc().nullsLast().op("text_ops")),
// 	index("User_userId_idx").using("btree", table.userId.asc().nullsLast().op("text_ops")),
// 	// foreignKey({
// 	// 	columns: [table.roleId],
// 	// 	foreignColumns: [role.roleId],
// 	// 	name: "User_roleId_fkey"
// 	// }).onUpdate("cascade").onDelete("restrict"),
// ]);









// export const role = pgTable("Role", {
// 	roleId: text().primaryKey().notNull(),
// 	role: text().notNull(),
// 	// addedByUserId: text(),
// 	addedByType: addedByType().default('SYSTEM').notNull(),
// 	createdAt: timestamp({ precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
// 	updatedAt: timestamp({ precision: 3, mode: 'string' }).notNull(),
// 	deletedAt: timestamp({ precision: 3, mode: 'string' }),
// }, (table) => [
// 	uniqueIndex("Role_role_key").using("btree", table.role.asc().nullsLast().op("text_ops")),
// 	foreignKey({
// 		columns: [table.addedByUserId],
// 		foreignColumns: [user.userId],
// 		name: "Role_addedByUserId_fkey"
// 	}).onUpdate("cascade").onDelete("set null"),
// ]);


// export const deliveryCharge = pgTable("DeliveryCharge", {
// 	id: text().primaryKey().notNull(),
// 	pinCode: text().notNull(),
// 	size: text().notNull(),
// 	cost: numeric({ precision: 65, scale: 30 }).notNull(),
// 	createdAt: timestamp({ precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
// 	updatedAt: timestamp({ precision: 3, mode: 'string' }).notNull(),
// }, (table) => [
// 	uniqueIndex("DeliveryCharge_pinCode_size_key").using("btree", table.pinCode.asc().nullsLast().op("text_ops"), table.size.asc().nullsLast().op("text_ops")),
// ]);

// export const globalOverheads = pgTable("GlobalOverheads", {
// 	overheadId: text().primaryKey().notNull(),
// 	name: text().notNull(),
// 	category: text(),
// 	appliesTo: text(),
// 	amount: numeric({ precision: 65, scale: 30 }).notNull(),
// 	createdAt: timestamp({ precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
// 	updatedAt: timestamp({ precision: 3, mode: 'string' }).notNull(),
// 	deletedAt: timestamp({ precision: 3, mode: 'string' }),
// });






// export const roleCreationAuditLog = pgTable("RoleCreationAuditLog", {
// 	logId: text().primaryKey().notNull(),
// 	roleId: text().notNull(),
// 	createdById: text(),
// 	createdByType: addedByType().default('SYSTEM').notNull(),
// 	createdAt: timestamp({ precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
// 	updatedAt: timestamp({ precision: 3, mode: 'string' }).notNull(),
// }, (table) => [
// 	foreignKey({
// 		columns: [table.roleId],
// 		foreignColumns: [role.roleId],
// 		name: "RoleCreationAuditLog_roleId_fkey"
// 	}).onUpdate("cascade").onDelete("restrict"),
// 	foreignKey({
// 		columns: [table.createdById],
// 		foreignColumns: [user.userId],
// 		name: "RoleCreationAuditLog_createdById_fkey"
// 	}).onUpdate("cascade").onDelete("set null"),
// ]);

// export const action = pgTable("Action", {
// 	actionId: text().primaryKey().notNull(),
// 	addedByUserId: text(),
// 	addedByType: addedByType().default('SYSTEM').notNull(),
// 	name: text().notNull(),
// 	displayName: text(),
// 	description: text(),
// 	createdAt: timestamp({ precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
// 	updatedAt: timestamp({ precision: 3, mode: 'string' }).notNull(),
// 	deletedAt: timestamp({ precision: 3, mode: 'string' }),
// }, (table) => [
// 	uniqueIndex("Action_name_key").using("btree", table.name.asc().nullsLast().op("text_ops")),
// 	foreignKey({
// 		columns: [table.addedByUserId],
// 		foreignColumns: [user.userId],
// 		name: "Action_addedByUserId_fkey"
// 	}).onUpdate("cascade").onDelete("set null"),
// ]);

// export const module = pgTable("Module", {
// 	moduleId: text().primaryKey().notNull(),
// 	addedByUserId: text(),
// 	addedByType: addedByType().default('SYSTEM').notNull(),
// 	name: text().notNull(),
// 	description: text(),
// 	createdAt: timestamp({ precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
// 	updatedAt: timestamp({ precision: 3, mode: 'string' }).notNull(),
// 	deletedAt: timestamp({ precision: 3, mode: 'string' }),
// }, (table) => [
// 	uniqueIndex("Module_name_key").using("btree", table.name.asc().nullsLast().op("text_ops")),
// 	foreignKey({
// 		columns: [table.addedByUserId],
// 		foreignColumns: [user.userId],
// 		name: "Module_addedByUserId_fkey"
// 	}).onUpdate("cascade").onDelete("set null"),
// ]);

// export const resource = pgTable("Resource", {
// 	resourceId: text().primaryKey().notNull(),
// 	moduleId: text().notNull(),
// 	addedByUserId: text(),
// 	addedByType: addedByType().default('SYSTEM').notNull(),
// 	name: text().notNull(),
// 	description: text(),
// 	createdAt: timestamp({ precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
// 	updatedAt: timestamp({ precision: 3, mode: 'string' }).notNull(),
// 	deletedAt: timestamp({ precision: 3, mode: 'string' }),
// }, (table) => [
// 	uniqueIndex("Resource_name_moduleId_key").using("btree", table.name.asc().nullsLast().op("text_ops"), table.moduleId.asc().nullsLast().op("text_ops")),
// 	foreignKey({
// 		columns: [table.moduleId],
// 		foreignColumns: [module.moduleId],
// 		name: "Resource_moduleId_fkey"
// 	}).onUpdate("cascade").onDelete("cascade"),
// 	foreignKey({
// 		columns: [table.addedByUserId],
// 		foreignColumns: [user.userId],
// 		name: "Resource_addedByUserId_fkey"
// 	}).onUpdate("cascade").onDelete("set null"),
// ]);

// export const permission = pgTable("Permission", {
// 	permissionId: text().primaryKey().notNull(),
// 	actionId: text().notNull(),
// 	resourceId: text().notNull(),
// 	moduleId: text().notNull(),
// 	addedByUserId: text(),
// 	addedByType: addedByType().default('SYSTEM').notNull(),
// 	description: text(),
// 	createdAt: timestamp({ precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
// 	updatedAt: timestamp({ precision: 3, mode: 'string' }).notNull(),
// 	deletedAt: timestamp({ precision: 3, mode: 'string' }),
// }, (table) => [
// 	uniqueIndex("Permission_actionId_resourceId_moduleId_key").using("btree", table.actionId.asc().nullsLast().op("text_ops"), table.resourceId.asc().nullsLast().op("text_ops"), table.moduleId.asc().nullsLast().op("text_ops")),
// 	foreignKey({
// 		columns: [table.actionId],
// 		foreignColumns: [action.actionId],
// 		name: "Permission_actionId_fkey"
// 	}).onUpdate("cascade").onDelete("cascade"),
// 	foreignKey({
// 		columns: [table.resourceId],
// 		foreignColumns: [resource.resourceId],
// 		name: "Permission_resourceId_fkey"
// 	}).onUpdate("cascade").onDelete("cascade"),
// 	foreignKey({
// 		columns: [table.moduleId],
// 		foreignColumns: [module.moduleId],
// 		name: "Permission_moduleId_fkey"
// 	}).onUpdate("cascade").onDelete("cascade"),
// 	foreignKey({
// 		columns: [table.addedByUserId],
// 		foreignColumns: [user.userId],
// 		name: "Permission_addedByUserId_fkey"
// 	}).onUpdate("cascade").onDelete("set null"),
// ]);

// export const rolePermissionAuditLog = pgTable("RolePermissionAuditLog", {
// 	logId: text().primaryKey().notNull(),
// 	roleId: text().notNull(),
// 	permissionId: text().notNull(),
// 	action: auditAction().notNull(),
// 	reason: text(),
// 	addedByUserId: text(),
// 	addedByType: addedByType().default('SYSTEM').notNull(),
// 	createdAt: timestamp({ precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
// 	updatedAt: timestamp({ precision: 3, mode: 'string' }).notNull(),
// }, (table) => [
// 	foreignKey({
// 		columns: [table.roleId],
// 		foreignColumns: [role.roleId],
// 		name: "RolePermissionAuditLog_roleId_fkey"
// 	}).onUpdate("cascade").onDelete("restrict"),
// 	foreignKey({
// 		columns: [table.permissionId],
// 		foreignColumns: [permission.permissionId],
// 		name: "RolePermissionAuditLog_permissionId_fkey"
// 	}).onUpdate("cascade").onDelete("restrict"),
// 	foreignKey({
// 		columns: [table.addedByUserId],
// 		foreignColumns: [user.userId],
// 		name: "RolePermissionAuditLog_addedByUserId_fkey"
// 	}).onUpdate("cascade").onDelete("set null"),
// ]);

// export const userPermissionAuditLog = pgTable("UserPermissionAuditLog", {
// 	logId: text().primaryKey().notNull(),
// 	userId: text().notNull(),
// 	permissionId: text().notNull(),
// 	action: auditAction().notNull(),
// 	previousAllowed: boolean(),
// 	newAllowed: boolean(),
// 	reason: text(),
// 	addedByUserId: text(),
// 	addedByType: addedByType().default('SYSTEM').notNull(),
// 	createdAt: timestamp({ precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
// 	updatedAt: timestamp({ precision: 3, mode: 'string' }).notNull(),
// }, (table) => [
// 	foreignKey({
// 		columns: [table.userId],
// 		foreignColumns: [user.userId],
// 		name: "UserPermissionAuditLog_userId_fkey"
// 	}).onUpdate("cascade").onDelete("restrict"),
// 	foreignKey({
// 		columns: [table.permissionId],
// 		foreignColumns: [permission.permissionId],
// 		name: "UserPermissionAuditLog_permissionId_fkey"
// 	}).onUpdate("cascade").onDelete("restrict"),
// 	foreignKey({
// 		columns: [table.addedByUserId],
// 		foreignColumns: [user.userId],
// 		name: "UserPermissionAuditLog_addedByUserId_fkey"
// 	}).onUpdate("cascade").onDelete("set null"),
// ]);

// export const group = pgTable("Group", {
// 	groupId: text().primaryKey().notNull(),
// 	name: text().notNull(),
// 	createdAt: timestamp({ precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
// 	updatedAt: timestamp({ precision: 3, mode: 'string' }).notNull(),
// 	deletedAt: timestamp({ precision: 3, mode: 'string' }),
// });

// export const groupPermission = pgTable("GroupPermission", {
// 	id: text().primaryKey().notNull(),
// 	groupId: text().notNull(),
// 	actionId: text().notNull(),
// 	resourceId: text().notNull(),
// 	moduleId: text().notNull(),
// 	createdAt: timestamp({ precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
// 	updatedAt: timestamp({ precision: 3, mode: 'string' }).notNull(),
// 	deletedAt: timestamp({ precision: 3, mode: 'string' }),
// }, (table) => [
// 	uniqueIndex("GroupPermission_groupId_actionId_resourceId_moduleId_key").using("btree", table.groupId.asc().nullsLast().op("text_ops"), table.actionId.asc().nullsLast().op("text_ops"), table.resourceId.asc().nullsLast().op("text_ops"), table.moduleId.asc().nullsLast().op("text_ops")),
// 	foreignKey({
// 		columns: [table.groupId],
// 		foreignColumns: [group.groupId],
// 		name: "GroupPermission_groupId_fkey"
// 	}).onUpdate("cascade").onDelete("restrict"),
// 	foreignKey({
// 		columns: [table.actionId],
// 		foreignColumns: [action.actionId],
// 		name: "GroupPermission_actionId_fkey"
// 	}).onUpdate("cascade").onDelete("restrict"),
// 	foreignKey({
// 		columns: [table.resourceId],
// 		foreignColumns: [resource.resourceId],
// 		name: "GroupPermission_resourceId_fkey"
// 	}).onUpdate("cascade").onDelete("restrict"),
// 	foreignKey({
// 		columns: [table.moduleId],
// 		foreignColumns: [module.moduleId],
// 		name: "GroupPermission_moduleId_fkey"
// 	}).onUpdate("cascade").onDelete("restrict"),
// ]);

// export const groupPermissionAuditLog = pgTable("GroupPermissionAuditLog", {
// 	logId: text().primaryKey().notNull(),
// 	groupId: text().notNull(),
// 	actionId: text().notNull(),
// 	resourceId: text().notNull(),
// 	moduleId: text().notNull(),
// 	action: auditAction().notNull(),
// 	reason: text(),
// 	addedByUserId: text(),
// 	addedByType: addedByType().default('SYSTEM').notNull(),
// 	createdAt: timestamp({ precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
// 	updatedAt: timestamp({ precision: 3, mode: 'string' }).notNull(),
// }, (table) => [
// 	foreignKey({
// 		columns: [table.groupId],
// 		foreignColumns: [group.groupId],
// 		name: "GroupPermissionAuditLog_groupId_fkey"
// 	}).onUpdate("cascade").onDelete("restrict"),
// 	foreignKey({
// 		columns: [table.addedByUserId],
// 		foreignColumns: [user.userId],
// 		name: "GroupPermissionAuditLog_addedByUserId_fkey"
// 	}).onUpdate("cascade").onDelete("set null"),
// 	foreignKey({
// 		columns: [table.actionId],
// 		foreignColumns: [action.actionId],
// 		name: "GroupPermissionAuditLog_actionId_fkey"
// 	}).onUpdate("cascade").onDelete("restrict"),
// 	foreignKey({
// 		columns: [table.resourceId],
// 		foreignColumns: [resource.resourceId],
// 		name: "GroupPermissionAuditLog_resourceId_fkey"
// 	}).onUpdate("cascade").onDelete("restrict"),
// 	foreignKey({
// 		columns: [table.moduleId],
// 		foreignColumns: [module.moduleId],
// 		name: "GroupPermissionAuditLog_moduleId_fkey"
// 	}).onUpdate("cascade").onDelete("restrict"),
// ]);

// export const customer = pgTable("Customer", {
// 	customerId: text().primaryKey().notNull(),
// 	userId: text().notNull(),
// 	loyaltyPoints: integer().default(0).notNull(),
// 	loyaltyTier: text(),
// 	preferredPayment: text(),
// 	totalSpent: numeric({ precision: 65, scale: 30 }).default('0.0').notNull(),
// 	orderCount: integer().default(0).notNull(),
// 	avgOrderValue: numeric({ precision: 65, scale: 30 }).default('0.0').notNull(),
// 	daysBetweenOrders: integer(),
// 	orderFrequency: numeric({ precision: 65, scale: 30 }),
// 	predictedSpend: numeric({ precision: 65, scale: 30 }),
// 	spendTier: text(),
// 	isActive: boolean().default(true).notNull(),
// 	firstOrderAt: timestamp({ precision: 3, mode: 'string' }),
// 	lastOrderAt: timestamp({ precision: 3, mode: 'string' }),
// 	lastLogin: timestamp({ precision: 3, mode: 'string' }),
// 	accountCreatedAt: timestamp({ precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
// 	updatedAt: timestamp({ precision: 3, mode: 'string' }).notNull(),
// 	deletedAt: timestamp({ precision: 3, mode: 'string' }),
// }, (table) => [
// 	uniqueIndex("Customer_userId_key").using("btree", table.userId.asc().nullsLast().op("text_ops")),
// 	foreignKey({
// 		columns: [table.userId],
// 		foreignColumns: [user.userId],
// 		name: "Customer_userId_fkey"
// 	}).onUpdate("cascade").onDelete("restrict"),
// ]);

// export const admin = pgTable("Admin", {
// 	adminId: text().primaryKey().notNull(),
// 	userId: text().notNull(),
// 	createdAt: timestamp({ precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
// 	updatedAt: timestamp({ precision: 3, mode: 'string' }).notNull(),
// 	deletedAt: timestamp({ precision: 3, mode: 'string' }),
// }, (table) => [
// 	uniqueIndex("Admin_userId_key").using("btree", table.userId.asc().nullsLast().op("text_ops")),
// 	foreignKey({
// 		columns: [table.userId],
// 		foreignColumns: [user.userId],
// 		name: "Admin_userId_fkey"
// 	}).onUpdate("cascade").onDelete("restrict"),
// ]);

// export const superAdmin = pgTable("SuperAdmin", {
// 	superAdminId: text().primaryKey().notNull(),
// 	userId: text().notNull(),
// 	createdAt: timestamp({ precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
// 	updatedAt: timestamp({ precision: 3, mode: 'string' }).notNull(),
// 	deletedAt: timestamp({ precision: 3, mode: 'string' }),
// }, (table) => [
// 	uniqueIndex("SuperAdmin_userId_key").using("btree", table.userId.asc().nullsLast().op("text_ops")),
// 	foreignKey({
// 		columns: [table.userId],
// 		foreignColumns: [user.userId],
// 		name: "SuperAdmin_userId_fkey"
// 	}).onUpdate("cascade").onDelete("restrict"),
// ]);

// export const employee = pgTable("Employee", {
// 	employeeId: text().primaryKey().notNull(),
// 	userId: text().notNull(),
// 	designation: text(),
// 	department: text(),
// 	joiningDate: timestamp({ precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
// 	isActive: boolean().default(true).notNull(),
// 	createdAt: timestamp({ precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
// 	updatedAt: timestamp({ precision: 3, mode: 'string' }).notNull(),
// 	deletedAt: timestamp({ precision: 3, mode: 'string' }),
// }, (table) => [
// 	uniqueIndex("Employee_userId_key").using("btree", table.userId.asc().nullsLast().op("text_ops")),
// 	foreignKey({
// 		columns: [table.userId],
// 		foreignColumns: [user.userId],
// 		name: "Employee_userId_fkey"
// 	}).onUpdate("cascade").onDelete("restrict"),
// ]);



// export const warehouseEmployee = pgTable("WarehouseEmployee", {
// 	warehouseEmployeeId: text().primaryKey().notNull(),
// 	warehouseId: text().notNull(),
// 	employeeId: text().notNull(),
// 	assignedByUserId: text().notNull(),
// 	assignedAt: timestamp({ precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
// 	createdAt: timestamp({ precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
// 	updatedAt: timestamp({ precision: 3, mode: 'string' }).notNull(),
// 	deletedAt: timestamp({ precision: 3, mode: 'string' }),
// }, (table) => [
// 	foreignKey({
// 		columns: [table.warehouseId],
// 		foreignColumns: [warehouse.warehouseId],
// 		name: "WarehouseEmployee_warehouseId_fkey"
// 	}).onUpdate("cascade").onDelete("restrict"),
// 	foreignKey({
// 		columns: [table.employeeId],
// 		foreignColumns: [employee.employeeId],
// 		name: "WarehouseEmployee_employeeId_fkey"
// 	}).onUpdate("cascade").onDelete("restrict"),
// 	foreignKey({
// 		columns: [table.assignedByUserId],
// 		foreignColumns: [user.userId],
// 		name: "WarehouseEmployee_assignedByUserId_fkey"
// 	}).onUpdate("cascade").onDelete("restrict"),
// ]);

// export const supplier = pgTable("Supplier", {
// 	supplierId: text().primaryKey().notNull(),
// 	userId: text().notNull(),
// 	warehouseId: text(),
// 	nurseryName: text(),
// 	businessCategory: text(),
// 	gstin: text(),
// 	tradeLicenseUrl: text(),
// 	publicId: text(),
// 	status: text().default('REGISTERED').notNull(),
// 	isVerified: boolean().default(false).notNull(),
// 	createdAt: timestamp({ precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
// 	updatedAt: timestamp({ precision: 3, mode: 'string' }).notNull(),
// 	deletedAt: timestamp({ precision: 3, mode: 'string' }),
// }, (table) => [
// 	uniqueIndex("Supplier_userId_key").using("btree", table.userId.asc().nullsLast().op("text_ops")),
// 	uniqueIndex("Supplier_userId_warehouseId_key").using("btree", table.userId.asc().nullsLast().op("text_ops"), table.warehouseId.asc().nullsLast().op("text_ops")),
// 	foreignKey({
// 		columns: [table.userId],
// 		foreignColumns: [user.userId],
// 		name: "Supplier_userId_fkey"
// 	}).onUpdate("cascade").onDelete("restrict"),
// 	foreignKey({
// 		columns: [table.warehouseId],
// 		foreignColumns: [warehouse.warehouseId],
// 		name: "Supplier_warehouseId_fkey"
// 	}).onUpdate("cascade").onDelete("set null"),
// ]);

// export const nurseryMediaAsset = pgTable("NurseryMediaAsset", {
// 	id: text().primaryKey().notNull(),
// 	supplierId: text().notNull(),
// 	publicId: text().notNull(),
// 	mediaUrl: text().notNull(),
// 	mediaType: text(),
// 	resourceType: text(),
// 	isPrimary: boolean().default(false).notNull(),
// 	createdAt: timestamp({ precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
// 	updatedAt: timestamp({ precision: 3, mode: 'string' }).notNull(),
// 	deletedAt: timestamp({ precision: 3, mode: 'string' }),
// }, (table) => [
// 	index("NurseryMediaAsset_supplierId_idx").using("btree", table.supplierId.asc().nullsLast().op("text_ops")),
// 	foreignKey({
// 		columns: [table.supplierId],
// 		foreignColumns: [supplier.supplierId],
// 		name: "NurseryMediaAsset_supplierId_fkey"
// 	}).onUpdate("cascade").onDelete("restrict"),
// ]);

// export const customerSessions = pgTable("CustomerSessions", {
// 	sessionId: text().primaryKey().notNull(),
// 	customerId: text().notNull(),
// 	deviceId: text(),
// 	ipAddress: text(),
// 	deviceInfo: text(),
// 	locationCity: text(),
// 	locationDistrict: text(),
// 	locationState: text(),
// 	loginStatus: text(),
// 	pagesVisited: integer(),
// 	firstPage: text(),
// 	lastPage: text(),
// 	sessionStart: timestamp({ precision: 3, mode: 'string' }).notNull(),
// 	sessionEnd: timestamp({ precision: 3, mode: 'string' }).notNull(),
// 	totalTimeSpent: integer(),
// 	isMobile: boolean(),
// 	browserName: text(),
// 	osName: text(),
// 	sessionStatus: text(),
// }, (table) => [
// 	foreignKey({
// 		columns: [table.customerId],
// 		foreignColumns: [customer.customerId],
// 		name: "CustomerSessions_customerId_fkey"
// 	}).onUpdate("cascade").onDelete("restrict"),
// ]);

// export const notifyMeSubscription = pgTable("NotifyMeSubscription", {
// 	subscriptionId: text().primaryKey().notNull(),
// 	customerId: text(),
// 	plantId: text(),
// 	plantVariantId: text(),
// 	potCategoryId: text(),
// 	potVariantId: text(),
// 	email: text().notNull(),
// 	notified: boolean().default(false).notNull(),
// 	createdAt: timestamp({ precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
// 	notifiedAt: timestamp({ precision: 3, mode: 'string' }),
// }, (table) => [
// 	index("NotifyMeSubscription_customerId_idx").using("btree", table.customerId.asc().nullsLast().op("text_ops")),
// 	index("NotifyMeSubscription_notified_idx").using("btree", table.notified.asc().nullsLast().op("bool_ops")),
// 	index("NotifyMeSubscription_plantVariantId_idx").using("btree", table.plantVariantId.asc().nullsLast().op("text_ops")),
// 	index("NotifyMeSubscription_potVariantId_idx").using("btree", table.potVariantId.asc().nullsLast().op("text_ops")),
// 	foreignKey({
// 		columns: [table.customerId],
// 		foreignColumns: [customer.customerId],
// 		name: "NotifyMeSubscription_customerId_fkey"
// 	}).onUpdate("cascade").onDelete("set null"),
// 	foreignKey({
// 		columns: [table.plantId],
// 		foreignColumns: [plants.plantId],
// 		name: "NotifyMeSubscription_plantId_fkey"
// 	}).onUpdate("cascade").onDelete("set null"),
// 	foreignKey({
// 		columns: [table.plantVariantId],
// 		foreignColumns: [plantVariants.variantId],
// 		name: "NotifyMeSubscription_plantVariantId_fkey"
// 	}).onUpdate("cascade").onDelete("set null"),
// 	foreignKey({
// 		columns: [table.potCategoryId],
// 		foreignColumns: [potCategory.categoryId],
// 		name: "NotifyMeSubscription_potCategoryId_fkey"
// 	}).onUpdate("cascade").onDelete("set null"),
// 	foreignKey({
// 		columns: [table.potVariantId],
// 		foreignColumns: [potVariants.potVariantId],
// 		name: "NotifyMeSubscription_potVariantId_fkey"
// 	}).onUpdate("cascade").onDelete("set null"),
// ]);



// export const customerAddress = pgTable("CustomerAddress", {
// 	addressId: text().primaryKey().notNull(),
// 	customerId: text().notNull(),
// 	addressType: text().notNull(),
// 	address: jsonb().notNull(),
// 	isDefault: boolean().default(false).notNull(),
// 	createdAt: timestamp({ precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
// 	updatedAt: timestamp({ precision: 3, mode: 'string' }).notNull(),
// 	deletedAt: timestamp({ precision: 3, mode: 'string' }),
// }, (table) => [
// 	foreignKey({
// 		columns: [table.customerId],
// 		foreignColumns: [customer.customerId],
// 		name: "CustomerAddress_customerId_fkey"
// 	}).onUpdate("cascade").onDelete("restrict"),
// ]);

// export const plantCartItem = pgTable("PlantCartItem", {
// 	cartItemId: text().primaryKey().notNull(),
// 	customerId: text().notNull(),
// 	plantId: text().notNull(),
// 	plantVariantId: text().notNull(),
// 	couponId: text(),
// 	quantity: integer().default(1).notNull(),
// 	priceAtAdd: numeric({ precision: 65, scale: 30 }).notNull(),
// 	addedAt: timestamp({ precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
// 	updatedAt: timestamp({ precision: 3, mode: 'string' }).notNull(),
// 	deletedAt: timestamp({ precision: 3, mode: 'string' }),
// }, (table) => [
// 	uniqueIndex("PlantCartItem_customerId_plantId_plantVariantId_key").using("btree", table.customerId.asc().nullsLast().op("text_ops"), table.plantId.asc().nullsLast().op("text_ops"), table.plantVariantId.asc().nullsLast().op("text_ops")),
// 	foreignKey({
// 		columns: [table.customerId],
// 		foreignColumns: [customer.customerId],
// 		name: "PlantCartItem_customerId_fkey"
// 	}).onUpdate("cascade").onDelete("restrict"),
// 	foreignKey({
// 		columns: [table.plantId],
// 		foreignColumns: [plants.plantId],
// 		name: "PlantCartItem_plantId_fkey"
// 	}).onUpdate("cascade").onDelete("restrict"),
// 	foreignKey({
// 		columns: [table.plantVariantId],
// 		foreignColumns: [plantVariants.variantId],
// 		name: "PlantCartItem_plantVariantId_fkey"
// 	}).onUpdate("cascade").onDelete("restrict"),
// 	foreignKey({
// 		columns: [table.couponId],
// 		foreignColumns: [promoCode.promoCodeId],
// 		name: "PlantCartItem_couponId_fkey"
// 	}).onUpdate("cascade").onDelete("set null"),
// ]);

// export const promoCode = pgTable("PromoCode", {
// 	promoCodeId: text().primaryKey().notNull(),
// 	code: text().notNull(),
// 	description: text(),
// 	discountType: text().notNull(),
// 	discountValue: numeric({ precision: 65, scale: 30 }).notNull(),
// 	minOrderAmount: numeric({ precision: 65, scale: 30 }),
// 	maxDiscountAmount: numeric({ precision: 65, scale: 30 }),
// 	startDate: timestamp({ precision: 3, mode: 'string' }).notNull(),
// 	endDate: timestamp({ precision: 3, mode: 'string' }).notNull(),
// 	isActive: boolean().default(true).notNull(),
// 	createdAt: timestamp({ precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
// 	updatedAt: timestamp({ precision: 3, mode: 'string' }).notNull(),
// 	deletedAt: timestamp({ precision: 3, mode: 'string' }),
// }, (table) => [
// 	uniqueIndex("PromoCode_code_key").using("btree", table.code.asc().nullsLast().op("text_ops")),
// ]);

// export const potCartItem = pgTable("PotCartItem", {
// 	cartItemId: text().primaryKey().notNull(),
// 	customerId: text().notNull(),
// 	potCategoryId: text().notNull(),
// 	potVariantId: text().notNull(),
// 	couponId: text(),
// 	quantity: integer().default(1).notNull(),
// 	priceAtAdd: numeric({ precision: 65, scale: 30 }).notNull(),
// 	addedAt: timestamp({ precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
// 	updatedAt: timestamp({ precision: 3, mode: 'string' }).notNull(),
// 	deletedAt: timestamp({ precision: 3, mode: 'string' }),
// }, (table) => [
// 	uniqueIndex("PotCartItem_customerId_potCategoryId_potVariantId_key").using("btree", table.customerId.asc().nullsLast().op("text_ops"), table.potCategoryId.asc().nullsLast().op("text_ops"), table.potVariantId.asc().nullsLast().op("text_ops")),
// 	foreignKey({
// 		columns: [table.customerId],
// 		foreignColumns: [customer.customerId],
// 		name: "PotCartItem_customerId_fkey"
// 	}).onUpdate("cascade").onDelete("restrict"),
// 	foreignKey({
// 		columns: [table.potCategoryId],
// 		foreignColumns: [potCategory.categoryId],
// 		name: "PotCartItem_potCategoryId_fkey"
// 	}).onUpdate("cascade").onDelete("restrict"),
// 	foreignKey({
// 		columns: [table.potVariantId],
// 		foreignColumns: [potVariants.potVariantId],
// 		name: "PotCartItem_potVariantId_fkey"
// 	}).onUpdate("cascade").onDelete("restrict"),
// 	foreignKey({
// 		columns: [table.couponId],
// 		foreignColumns: [promoCode.promoCodeId],
// 		name: "PotCartItem_couponId_fkey"
// 	}).onUpdate("cascade").onDelete("set null"),
// ]);

// export const plantCheckoutLater = pgTable("PlantCheckoutLater", {
// 	checkOutLaterId: text().primaryKey().notNull(),
// 	customerId: char({ length: 36 }).notNull(),
// 	plantId: char({ length: 36 }).notNull(),
// 	plantVariantId: char({ length: 36 }),
// 	promoCodeId: char({ length: 36 }),
// 	units: integer().notNull(),
// 	addedAt: timestamp({ precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
// 	updatedAt: timestamp({ precision: 3, mode: 'string' }).notNull(),
// 	deletedAt: timestamp({ precision: 3, mode: 'string' }),
// }, (table) => [
// 	uniqueIndex("PlantCheckoutLater_customerId_plantId_plantVariantId_key").using("btree", table.customerId.asc().nullsLast().op("bpchar_ops"), table.plantId.asc().nullsLast().op("bpchar_ops"), table.plantVariantId.asc().nullsLast().op("bpchar_ops")),
// 	foreignKey({
// 		columns: [table.customerId],
// 		foreignColumns: [customer.customerId],
// 		name: "PlantCheckoutLater_customerId_fkey"
// 	}).onUpdate("cascade").onDelete("restrict"),
// 	foreignKey({
// 		columns: [table.plantId],
// 		foreignColumns: [plants.plantId],
// 		name: "PlantCheckoutLater_plantId_fkey"
// 	}).onUpdate("cascade").onDelete("restrict"),
// 	foreignKey({
// 		columns: [table.plantVariantId],
// 		foreignColumns: [plantVariants.variantId],
// 		name: "PlantCheckoutLater_plantVariantId_fkey"
// 	}).onUpdate("cascade").onDelete("set null"),
// 	foreignKey({
// 		columns: [table.promoCodeId],
// 		foreignColumns: [promoCode.promoCodeId],
// 		name: "PlantCheckoutLater_promoCodeId_fkey"
// 	}).onUpdate("cascade").onDelete("set null"),
// ]);

// export const potCheckoutLater = pgTable("PotCheckoutLater", {
// 	checkOutLaterId: text().primaryKey().notNull(),
// 	customerId: char({ length: 36 }).notNull(),
// 	potCategoryId: char({ length: 36 }).notNull(),
// 	potVariantId: char({ length: 36 }),
// 	promoCodeId: char({ length: 36 }),
// 	units: integer().notNull(),
// 	addedAt: timestamp({ precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
// 	updatedAt: timestamp({ precision: 3, mode: 'string' }).notNull(),
// 	deletedAt: timestamp({ precision: 3, mode: 'string' }),
// }, (table) => [
// 	uniqueIndex("PotCheckoutLater_customerId_potCategoryId_potVariantId_key").using("btree", table.customerId.asc().nullsLast().op("bpchar_ops"), table.potCategoryId.asc().nullsLast().op("bpchar_ops"), table.potVariantId.asc().nullsLast().op("bpchar_ops")),
// 	foreignKey({
// 		columns: [table.customerId],
// 		foreignColumns: [customer.customerId],
// 		name: "PotCheckoutLater_customerId_fkey"
// 	}).onUpdate("cascade").onDelete("restrict"),
// 	foreignKey({
// 		columns: [table.potCategoryId],
// 		foreignColumns: [potCategory.categoryId],
// 		name: "PotCheckoutLater_potCategoryId_fkey"
// 	}).onUpdate("cascade").onDelete("restrict"),
// 	foreignKey({
// 		columns: [table.potVariantId],
// 		foreignColumns: [potVariants.potVariantId],
// 		name: "PotCheckoutLater_potVariantId_fkey"
// 	}).onUpdate("cascade").onDelete("set null"),
// 	foreignKey({
// 		columns: [table.promoCodeId],
// 		foreignColumns: [promoCode.promoCodeId],
// 		name: "PotCheckoutLater_promoCodeId_fkey"
// 	}).onUpdate("cascade").onDelete("set null"),
// ]);

// export const plantGenericCostComponent = pgTable("PlantGenericCostComponent", {
// 	componentId: text().primaryKey().notNull(),
// 	tagPrintingCost: numeric({ precision: 65, scale: 30 }).default('0.0').notNull(),
// 	marketingOverheadCost: numeric({ precision: 65, scale: 30 }).default('0.0').notNull(),
// 	paymentGatewayCostPercentage: numeric({ precision: 65, scale: 30 }).default('0.0').notNull(),
// 	courierSubscriptionCost: numeric({ precision: 65, scale: 30 }).default('0.0').notNull(),
// 	taxPercentage: numeric({ precision: 65, scale: 30 }).default('0.0').notNull(),
// 	deliveryMaintenanceCost: numeric({ precision: 65, scale: 30 }).default('0.0').notNull(),
// 	returnLossPercentage: numeric({ precision: 65, scale: 30 }).default('0.0').notNull(),
// 	inventoryDamagePercentage: numeric({ precision: 65, scale: 30 }).default('0.0').notNull(),
// 	variableCost: numeric({ precision: 65, scale: 30 }).default('0.0').notNull(),
// 	totalPlantGenericCost: numeric({ precision: 65, scale: 30 }).default('0.0').notNull(),
// 	createdAt: timestamp({ precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
// 	updatedAt: timestamp({ precision: 3, mode: 'string' }).notNull(),
// });

// export const plantSizeCostComponent = pgTable("PlantSizeCostComponent", {
// 	sizeCostComponentId: text().primaryKey().notNull(),
// 	plantSize: text().notNull(),
// 	plantCocopeatCost: numeric({ precision: 65, scale: 30 }).default('0.0').notNull(),
// 	plantPackagingCost: numeric({ precision: 65, scale: 30 }).default('0.0').notNull(),
// 	plantGiftPackagingCost: numeric({ precision: 65, scale: 30 }).default('0.0').notNull(),
// 	plantProfitMarginPercentage: numeric({ precision: 65, scale: 30 }).default('0.0').notNull(),
// 	plantFertilizersCost: numeric({ precision: 65, scale: 30 }).default('0.0').notNull(),
// 	totalPlantSizeCost: numeric({ precision: 65, scale: 30 }).default('0.0').notNull(),
// 	genericCostComponentId: text().notNull(),
// }, (table) => [
// 	uniqueIndex("PlantSizeCostComponent_genericCostComponentId_plantSize_key").using("btree", table.genericCostComponentId.asc().nullsLast().op("text_ops"), table.plantSize.asc().nullsLast().op("text_ops")),
// 	foreignKey({
// 		columns: [table.genericCostComponentId],
// 		foreignColumns: [plantGenericCostComponent.componentId],
// 		name: "PlantSizeCostComponent_genericCostComponentId_fkey"
// 	}).onUpdate("cascade").onDelete("restrict"),
// ]);

// export const potGenericCostComponent = pgTable("PotGenericCostComponent", {
// 	componentId: text().primaryKey().notNull(),
// 	tagPrintingCost: numeric({ precision: 65, scale: 30 }).default('0.0').notNull(),
// 	marketingOverheadCost: numeric({ precision: 65, scale: 30 }).default('0.0').notNull(),
// 	paymentGatewayCostPercentage: numeric({ precision: 65, scale: 30 }).default('0.0').notNull(),
// 	courierSubscriptionCost: numeric({ precision: 65, scale: 30 }).default('0.0').notNull(),
// 	taxPercentage: numeric({ precision: 65, scale: 30 }).default('0.0').notNull(),
// 	deliveryMaintenanceCost: numeric({ precision: 65, scale: 30 }).default('0.0').notNull(),
// 	returnLossPercentage: numeric({ precision: 65, scale: 30 }).default('0.0').notNull(),
// 	inventoryDamagePercentage: numeric({ precision: 65, scale: 30 }).default('0.0').notNull(),
// 	variableCost: numeric({ precision: 65, scale: 30 }).default('0.0').notNull(),
// 	totalPotGenericCost: numeric({ precision: 65, scale: 30 }).default('0.0').notNull(),
// 	createdAt: timestamp({ precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
// 	updatedAt: timestamp({ precision: 3, mode: 'string' }).notNull(),
// });

// export const potSizeCostComponent = pgTable("PotSizeCostComponent", {
// 	sizeCostComponentId: text().primaryKey().notNull(),
// 	potSize: text().notNull(),
// 	potPackagingCost: numeric({ precision: 65, scale: 30 }).default('0.0').notNull(),
// 	potGiftPackagingCost: numeric({ precision: 65, scale: 30 }).default('0.0').notNull(),
// 	potProfitMarginPercentage: numeric({ precision: 65, scale: 30 }).default('0.0').notNull(),
// 	totalPotSizeCost: numeric({ precision: 65, scale: 30 }).default('0.0').notNull(),
// 	genericCostComponentId: text().notNull(),
// }, (table) => [
// 	uniqueIndex("PotSizeCostComponent_genericCostComponentId_potSize_key").using("btree", table.genericCostComponentId.asc().nullsLast().op("text_ops"), table.potSize.asc().nullsLast().op("text_ops")),
// 	foreignKey({
// 		columns: [table.genericCostComponentId],
// 		foreignColumns: [potGenericCostComponent.componentId],
// 		name: "PotSizeCostComponent_genericCostComponentId_fkey"
// 	}).onUpdate("cascade").onDelete("restrict"),
// ]);

// export const order = pgTable("Order", {
// 	orderId: text().primaryKey().notNull(),
// 	invoiceNumber: text().notNull(),
// 	customerId: text().notNull(),
// 	promoCodeId: text(),
// 	orderDate: timestamp({ precision: 3, mode: 'string' }).notNull(),
// 	shippingDate: timestamp({ precision: 3, mode: 'string' }),
// 	deliveryDate: timestamp({ precision: 3, mode: 'string' }),
// 	returnEligibilityDate: timestamp({ precision: 3, mode: 'string' }).notNull(),
// 	orderStatus: text().notNull(),
// 	paymentStatus: text().notNull(),
// 	paymentMethod: text().notNull(),
// 	isExchangeOrder: boolean().default(false).notNull(),
// 	orderAmount: numeric({ precision: 65, scale: 30 }).notNull(),
// 	discountApplied: numeric({ precision: 65, scale: 30 }).notNull(),
// 	shippingCharges: numeric({ precision: 65, scale: 30 }).notNull(),
// 	taxCollected: numeric({ precision: 65, scale: 30 }).notNull(),
// 	finalPayableAmount: numeric({ precision: 65, scale: 30 }).notNull(),
// 	refundAmount: numeric({ precision: 65, scale: 30 }),
// 	createdAt: timestamp({ precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
// 	updatedAt: timestamp({ precision: 3, mode: 'string' }).notNull(),
// 	deletedAt: timestamp({ precision: 3, mode: 'string' }),
// }, (table) => [
// 	uniqueIndex("Order_invoiceNumber_key").using("btree", table.invoiceNumber.asc().nullsLast().op("text_ops")),
// 	foreignKey({
// 		columns: [table.customerId],
// 		foreignColumns: [customer.customerId],
// 		name: "Order_customerId_fkey"
// 	}).onUpdate("cascade").onDelete("restrict"),
// 	foreignKey({
// 		columns: [table.promoCodeId],
// 		foreignColumns: [promoCode.promoCodeId],
// 		name: "Order_promoCodeId_fkey"
// 	}).onUpdate("cascade").onDelete("set null"),
// ]);

// export const plantOrderItem = pgTable("PlantOrderItem", {
// 	orderItemId: text().primaryKey().notNull(),
// 	orderId: text().notNull(),
// 	plantId: text().notNull(),
// 	plantVariantId: text().notNull(),
// 	promoCodeId: text(),
// 	units: integer().notNull(),
// 	unitSellingPrice: numeric({ precision: 65, scale: 30 }).notNull(),
// 	totalSellingPrice: numeric({ precision: 65, scale: 30 }).notNull(),
// 	discountApplied: numeric({ precision: 65, scale: 30 }),
// 	taxApplied: numeric({ precision: 65, scale: 30 }),
// 	finalAmountPaid: numeric({ precision: 65, scale: 30 }),
// 	createdAt: timestamp({ precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
// 	updatedAt: timestamp({ precision: 3, mode: 'string' }).notNull(),
// 	deletedAt: timestamp({ precision: 3, mode: 'string' }),
// }, (table) => [
// 	index("PlantOrderItem_orderId_idx").using("btree", table.orderId.asc().nullsLast().op("text_ops")),
// 	foreignKey({
// 		columns: [table.plantId],
// 		foreignColumns: [plants.plantId],
// 		name: "PlantOrderItem_plantId_fkey"
// 	}).onUpdate("cascade").onDelete("restrict"),
// 	foreignKey({
// 		columns: [table.plantVariantId],
// 		foreignColumns: [plantVariants.variantId],
// 		name: "PlantOrderItem_plantVariantId_fkey"
// 	}).onUpdate("cascade").onDelete("restrict"),
// 	foreignKey({
// 		columns: [table.orderId],
// 		foreignColumns: [order.orderId],
// 		name: "PlantOrderItem_orderId_fkey"
// 	}).onUpdate("cascade").onDelete("restrict"),
// 	foreignKey({
// 		columns: [table.promoCodeId],
// 		foreignColumns: [promoCode.promoCodeId],
// 		name: "PlantOrderItem_promoCodeId_fkey"
// 	}).onUpdate("cascade").onDelete("set null"),
// ]);

// export const potOrderItem = pgTable("PotOrderItem", {
// 	orderItemId: text().primaryKey().notNull(),
// 	orderId: text().notNull(),
// 	potCategoryId: text().notNull(),
// 	potVariantId: text().notNull(),
// 	promoCodeId: text(),
// 	units: integer().notNull(),
// 	unitSellingPrice: numeric({ precision: 65, scale: 30 }).notNull(),
// 	totalSellingPrice: numeric({ precision: 65, scale: 30 }).notNull(),
// 	discountApplied: numeric({ precision: 65, scale: 30 }),
// 	taxApplied: numeric({ precision: 65, scale: 30 }),
// 	finalAmountPaid: numeric({ precision: 65, scale: 30 }),
// 	createdAt: timestamp({ precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
// 	updatedAt: timestamp({ precision: 3, mode: 'string' }).notNull(),
// 	deletedAt: timestamp({ precision: 3, mode: 'string' }),
// }, (table) => [
// 	index("PotOrderItem_orderId_idx").using("btree", table.orderId.asc().nullsLast().op("text_ops")),
// 	foreignKey({
// 		columns: [table.potCategoryId],
// 		foreignColumns: [potCategory.categoryId],
// 		name: "PotOrderItem_potCategoryId_fkey"
// 	}).onUpdate("cascade").onDelete("restrict"),
// 	foreignKey({
// 		columns: [table.potVariantId],
// 		foreignColumns: [potVariants.potVariantId],
// 		name: "PotOrderItem_potVariantId_fkey"
// 	}).onUpdate("cascade").onDelete("restrict"),
// 	foreignKey({
// 		columns: [table.orderId],
// 		foreignColumns: [order.orderId],
// 		name: "PotOrderItem_orderId_fkey"
// 	}).onUpdate("cascade").onDelete("restrict"),
// 	foreignKey({
// 		columns: [table.promoCodeId],
// 		foreignColumns: [promoCode.promoCodeId],
// 		name: "PotOrderItem_promoCodeId_fkey"
// 	}).onUpdate("cascade").onDelete("set null"),
// ]);

// export const payment = pgTable("Payment", {
// 	paymentId: text().primaryKey().notNull(),
// 	orderId: text().notNull(),
// 	transactionId: text().notNull(),
// 	method: text().notNull(),
// 	status: text().notNull(),
// 	amount: numeric({ precision: 65, scale: 30 }).notNull(),
// 	paymentDate: timestamp({ precision: 3, mode: 'string' }).notNull(),
// 	createdAt: timestamp({ precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
// 	updatedAt: timestamp({ precision: 3, mode: 'string' }).notNull(),
// 	deletedAt: timestamp({ precision: 3, mode: 'string' }),
// }, (table) => [
// 	foreignKey({
// 		columns: [table.orderId],
// 		foreignColumns: [order.orderId],
// 		name: "Payment_orderId_fkey"
// 	}).onUpdate("cascade").onDelete("restrict"),
// ]);

// export const orderCostDetails = pgTable("OrderCostDetails", {
// 	id: text().primaryKey().notNull(),
// 	orderId: text().notNull(),
// 	totalProductCost: numeric({ precision: 65, scale: 30 }).notNull(),
// 	totalGenericCost: numeric({ precision: 65, scale: 30 }).notNull(),
// 	totalSizeCost: numeric({ precision: 65, scale: 30 }).notNull(),
// 	totalCost: numeric({ precision: 65, scale: 30 }).notNull(),
// 	sellingPrice: numeric({ precision: 65, scale: 30 }).notNull(),
// 	profitMargin: numeric({ precision: 65, scale: 30 }),
// 	createdAt: timestamp({ precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
// 	updatedAt: timestamp({ precision: 3, mode: 'string' }).notNull(),
// }, (table) => [
// 	uniqueIndex("OrderCostDetails_orderId_key").using("btree", table.orderId.asc().nullsLast().op("text_ops")),
// 	foreignKey({
// 		columns: [table.orderId],
// 		foreignColumns: [order.orderId],
// 		name: "OrderCostDetails_orderId_fkey"
// 	}).onUpdate("cascade").onDelete("restrict"),
// ]);

// export const shipping = pgTable("Shipping", {
// 	shippingId: text().primaryKey().notNull(),
// 	orderId: text().notNull(),
// 	addressId: text().notNull(),
// 	courierName: text().notNull(),
// 	trackingNumber: text(),
// 	shippingStatus: text().notNull(),
// 	shippingMethod: text().notNull(),
// 	isExchangeShipment: boolean().notNull(),
// 	estimatedDeliveryDate: timestamp({ precision: 3, mode: 'string' }),
// 	actualDeliveryDate: timestamp({ precision: 3, mode: 'string' }),
// 	deliveredAt: timestamp({ precision: 3, mode: 'string' }),
// 	shippingCharges: numeric({ precision: 65, scale: 30 }).notNull(),
// 	createdAt: timestamp({ precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
// 	updatedAt: timestamp({ precision: 3, mode: 'string' }).notNull(),
// 	deletedAt: timestamp({ precision: 3, mode: 'string' }),
// }, (table) => [
// 	uniqueIndex("Shipping_orderId_key").using("btree", table.orderId.asc().nullsLast().op("text_ops")),
// 	foreignKey({
// 		columns: [table.addressId],
// 		foreignColumns: [customerAddress.addressId],
// 		name: "Shipping_addressId_fkey"
// 	}).onUpdate("cascade").onDelete("restrict"),
// 	foreignKey({
// 		columns: [table.orderId],
// 		foreignColumns: [order.orderId],
// 		name: "Shipping_orderId_fkey"
// 	}).onUpdate("cascade").onDelete("restrict"),
// ]);

// export const returnsRefunds = pgTable("ReturnsRefunds", {
// 	returnId: text().primaryKey().notNull(),
// 	orderId: text().notNull(),
// 	plantId: text().notNull(),
// 	customerId: text().notNull(),
// 	exchangeProductId: text(),
// 	exchangeShippingId: text(),
// 	reason: text().notNull(),
// 	remarks: text(),
// 	returnStatus: text().notNull(),
// 	refundStatus: text().notNull(),
// 	refundAmount: numeric({ precision: 65, scale: 30 }).notNull(),
// 	returnShippingCharges: numeric({ precision: 65, scale: 30 }).notNull(),
// 	returnCourier: text(),
// 	returnTrackingNo: text(),
// 	returnRequestDate: timestamp({ precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
// 	actualReturnPickupDate: timestamp({ precision: 3, mode: 'string' }),
// 	updatedAt: timestamp({ precision: 3, mode: 'string' }).notNull(),
// 	deletedAt: timestamp({ precision: 3, mode: 'string' }),
// }, (table) => [
// 	uniqueIndex("ReturnsRefunds_exchangeShippingId_key").using("btree", table.exchangeShippingId.asc().nullsLast().op("text_ops")),
// 	foreignKey({
// 		columns: [table.plantId],
// 		foreignColumns: [plants.plantId],
// 		name: "ReturnsRefunds_plantId_fkey"
// 	}).onUpdate("cascade").onDelete("restrict"),
// 	foreignKey({
// 		columns: [table.exchangeProductId],
// 		foreignColumns: [plants.plantId],
// 		name: "ReturnsRefunds_exchangeProductId_fkey"
// 	}).onUpdate("cascade").onDelete("set null"),
// 	foreignKey({
// 		columns: [table.orderId],
// 		foreignColumns: [order.orderId],
// 		name: "ReturnsRefunds_orderId_fkey"
// 	}).onUpdate("cascade").onDelete("restrict"),
// 	foreignKey({
// 		columns: [table.customerId],
// 		foreignColumns: [customer.customerId],
// 		name: "ReturnsRefunds_customerId_fkey"
// 	}).onUpdate("cascade").onDelete("restrict"),
// 	foreignKey({
// 		columns: [table.exchangeShippingId],
// 		foreignColumns: [shipping.shippingId],
// 		name: "ReturnsRefunds_exchangeShippingId_fkey"
// 	}).onUpdate("cascade").onDelete("set null"),
// ]);

// export const promotion = pgTable("Promotion", {
// 	promoId: text().primaryKey().notNull(),
// 	promoName: text().notNull(),
// 	description: text(),
// 	discountType: text().notNull(),
// 	discountValue: numeric({ precision: 65, scale: 30 }).notNull(),
// 	maxDiscount: numeric({ precision: 65, scale: 30 }),
// 	validFrom: timestamp({ precision: 3, mode: 'string' }).notNull(),
// 	validTo: timestamp({ precision: 3, mode: 'string' }).notNull(),
// 	usageLimit: integer(),
// 	usageCount: integer().default(0).notNull(),
// 	stackable: boolean().default(false).notNull(),
// 	isActive: boolean().default(true).notNull(),
// 	deletedAt: timestamp({ precision: 3, mode: 'string' }),
// 	createdAt: timestamp({ precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
// 	updatedAt: timestamp({ precision: 3, mode: 'string' }).notNull(),
// });

// export const promotionProduct = pgTable("PromotionProduct", {
// 	id: text().primaryKey().notNull(),
// 	promoId: text().notNull(),
// 	plantId: text(),
// 	plantVariantId: text(),
// 	potCategoryId: text(),
// 	potVariantId: text(),
// 	createdAt: timestamp({ precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
// 	updatedAt: timestamp({ precision: 3, mode: 'string' }).notNull(),
// 	deletedAt: timestamp({ precision: 3, mode: 'string' }),
// }, (table) => [
// 	foreignKey({
// 		columns: [table.promoId],
// 		foreignColumns: [promotion.promoId],
// 		name: "PromotionProduct_promoId_fkey"
// 	}).onUpdate("cascade").onDelete("restrict"),
// 	foreignKey({
// 		columns: [table.plantId],
// 		foreignColumns: [plants.plantId],
// 		name: "PromotionProduct_plantId_fkey"
// 	}).onUpdate("cascade").onDelete("set null"),
// 	foreignKey({
// 		columns: [table.plantVariantId],
// 		foreignColumns: [plantVariants.variantId],
// 		name: "PromotionProduct_plantVariantId_fkey"
// 	}).onUpdate("cascade").onDelete("set null"),
// 	foreignKey({
// 		columns: [table.potCategoryId],
// 		foreignColumns: [potCategory.categoryId],
// 		name: "PromotionProduct_potCategoryId_fkey"
// 	}).onUpdate("cascade").onDelete("set null"),
// 	foreignKey({
// 		columns: [table.potVariantId],
// 		foreignColumns: [potVariants.potVariantId],
// 		name: "PromotionProduct_potVariantId_fkey"
// 	}).onUpdate("cascade").onDelete("set null"),
// ]);

// export const referralCode = pgTable("ReferralCode", {
// 	referralId: text().primaryKey().notNull(),
// 	referralCode: text().notNull(),
// 	referrerCustomerId: text().notNull(),
// 	rewardType: text().notNull(),
// 	rewardValue: numeric({ precision: 65, scale: 30 }),
// 	eligibility: text(),
// 	isActive: boolean().default(true).notNull(),
// 	deletedAt: timestamp({ precision: 3, mode: 'string' }),
// 	createdAt: timestamp({ precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
// 	updatedAt: timestamp({ precision: 3, mode: 'string' }).notNull(),
// }, (table) => [
// 	uniqueIndex("ReferralCode_referralCode_key").using("btree", table.referralCode.asc().nullsLast().op("text_ops")),
// 	uniqueIndex("ReferralCode_referrerCustomerId_key").using("btree", table.referrerCustomerId.asc().nullsLast().op("text_ops")),
// 	foreignKey({
// 		columns: [table.referrerCustomerId],
// 		foreignColumns: [customer.customerId],
// 		name: "ReferralCode_referrerCustomerId_fkey"
// 	}).onUpdate("cascade").onDelete("restrict"),
// ]);

// export const referralUsage = pgTable("ReferralUsage", {
// 	usageId: text().primaryKey().notNull(),
// 	referralId: text().notNull(),
// 	referredCustomerId: text().notNull(),
// 	used: boolean().default(false).notNull(),
// 	referredAt: timestamp({ precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
// 	usedAt: timestamp({ precision: 3, mode: 'string' }),
// 	rewardGranted: boolean().default(false).notNull(),
// }, (table) => [
// 	uniqueIndex("ReferralUsage_referralId_referredCustomerId_key").using("btree", table.referralId.asc().nullsLast().op("text_ops"), table.referredCustomerId.asc().nullsLast().op("text_ops")),
// 	foreignKey({
// 		columns: [table.referralId],
// 		foreignColumns: [referralCode.referralId],
// 		name: "ReferralUsage_referralId_fkey"
// 	}).onUpdate("cascade").onDelete("restrict"),
// 	foreignKey({
// 		columns: [table.referredCustomerId],
// 		foreignColumns: [customer.customerId],
// 		name: "ReferralUsage_referredCustomerId_fkey"
// 	}).onUpdate("cascade").onDelete("restrict"),
// ]);

// export const plantStockAuditLog = pgTable("PlantStockAuditLog", {
// 	auditId: text().primaryKey().notNull(),
// 	plantId: text().notNull(),
// 	plantVariantId: text(),
// 	warehouseId: text().notNull(),
// 	eventType: text().notNull(),
// 	stockDelta: integer().notNull(),
// 	sourceTable: text().notNull(),
// 	sourceRefId: text().notNull(),
// 	userId: text().notNull(),
// 	notes: text(),
// 	createdAt: timestamp({ precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
// }, (table) => [
// 	foreignKey({
// 		columns: [table.plantId],
// 		foreignColumns: [plants.plantId],
// 		name: "PlantStockAuditLog_plantId_fkey"
// 	}).onUpdate("cascade").onDelete("restrict"),
// 	foreignKey({
// 		columns: [table.plantVariantId],
// 		foreignColumns: [plantVariants.variantId],
// 		name: "PlantStockAuditLog_plantVariantId_fkey"
// 	}).onUpdate("cascade").onDelete("set null"),
// 	foreignKey({
// 		columns: [table.warehouseId],
// 		foreignColumns: [warehouse.warehouseId],
// 		name: "PlantStockAuditLog_warehouseId_fkey"
// 	}).onUpdate("cascade").onDelete("restrict"),
// ]);

// export const potStockAuditLog = pgTable("PotStockAuditLog", {
// 	auditId: text().primaryKey().notNull(),
// 	potCategoryId: text().notNull(),
// 	potVariantId: text(),
// 	warehouseId: text().notNull(),
// 	eventType: text().notNull(),
// 	stockDelta: integer().notNull(),
// 	sourceTable: text().notNull(),
// 	sourceRefId: text().notNull(),
// 	userId: text().notNull(),
// 	notes: text(),
// 	createdAt: timestamp({ precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
// }, (table) => [
// 	foreignKey({
// 		columns: [table.potCategoryId],
// 		foreignColumns: [potCategory.categoryId],
// 		name: "PotStockAuditLog_potCategoryId_fkey"
// 	}).onUpdate("cascade").onDelete("restrict"),
// 	foreignKey({
// 		columns: [table.potVariantId],
// 		foreignColumns: [potVariants.potVariantId],
// 		name: "PotStockAuditLog_potVariantId_fkey"
// 	}).onUpdate("cascade").onDelete("set null"),
// 	foreignKey({
// 		columns: [table.warehouseId],
// 		foreignColumns: [warehouse.warehouseId],
// 		name: "PotStockAuditLog_warehouseId_fkey"
// 	}).onUpdate("cascade").onDelete("restrict"),
// ]);

// export const plantDamagedProduct = pgTable("PlantDamagedProduct", {
// 	damageId: text().primaryKey().notNull(),
// 	plantId: text().notNull(),
// 	plantVariantId: text(),
// 	warehouseId: text().notNull(),
// 	purchaseOrderId: text(),
// 	purchaseOrderItemId: text(),
// 	orderId: text(),
// 	plantOrderItemId: text(),
// 	handledById: text().notNull(),
// 	damageType: damageType().notNull(),
// 	unitsDamaged: integer().notNull(),
// 	unitsDamagedPrice: numeric({ precision: 65, scale: 30 }).notNull(),
// 	totalAmount: numeric({ precision: 65, scale: 30 }).notNull(),
// 	reason: text().notNull(),
// 	notes: text(),
// 	handledBy: text().notNull(),
// 	reportDate: timestamp({ precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
// 	publicId: text().notNull(),
// 	mediaUrl: text().notNull(),
// 	createdAt: timestamp({ precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
// 	updatedAt: timestamp({ precision: 3, mode: 'string' }).notNull(),
// 	deletedAt: timestamp({ precision: 3, mode: 'string' }),
// }, (table) => [
// 	uniqueIndex("PlantDamagedProduct_plantOrderItemId_key").using("btree", table.plantOrderItemId.asc().nullsLast().op("text_ops")),
// 	uniqueIndex("PlantDamagedProduct_purchaseOrderItemId_key").using("btree", table.purchaseOrderItemId.asc().nullsLast().op("text_ops")),
// 	foreignKey({
// 		columns: [table.plantId],
// 		foreignColumns: [plants.plantId],
// 		name: "PlantDamagedProduct_plantId_fkey"
// 	}).onUpdate("cascade").onDelete("restrict"),
// 	foreignKey({
// 		columns: [table.plantVariantId],
// 		foreignColumns: [plantVariants.variantId],
// 		name: "PlantDamagedProduct_plantVariantId_fkey"
// 	}).onUpdate("cascade").onDelete("set null"),
// 	foreignKey({
// 		columns: [table.warehouseId],
// 		foreignColumns: [warehouse.warehouseId],
// 		name: "PlantDamagedProduct_warehouseId_fkey"
// 	}).onUpdate("cascade").onDelete("restrict"),
// 	foreignKey({
// 		columns: [table.purchaseOrderId],
// 		foreignColumns: [purchaseOrder.id],
// 		name: "PlantDamagedProduct_purchaseOrderId_fkey"
// 	}).onUpdate("cascade").onDelete("set null"),
// 	foreignKey({
// 		columns: [table.purchaseOrderItemId],
// 		foreignColumns: [purchaseOrderItems.id],
// 		name: "PlantDamagedProduct_purchaseOrderItemId_fkey"
// 	}).onUpdate("cascade").onDelete("set null"),
// 	foreignKey({
// 		columns: [table.orderId],
// 		foreignColumns: [order.orderId],
// 		name: "PlantDamagedProduct_orderId_fkey"
// 	}).onUpdate("cascade").onDelete("set null"),
// 	foreignKey({
// 		columns: [table.plantOrderItemId],
// 		foreignColumns: [plantOrderItem.orderItemId],
// 		name: "PlantDamagedProduct_plantOrderItemId_fkey"
// 	}).onUpdate("cascade").onDelete("set null"),
// ]);

// export const purchaseOrder = pgTable("PurchaseOrder", {
// 	id: text().primaryKey().notNull(),
// 	warehouseId: text().notNull(),
// 	supplierId: text().notNull(),
// 	deliveryCharges: numeric({ precision: 65, scale: 30 }),
// 	totalCost: numeric({ precision: 65, scale: 30 }),
// 	pendingAmount: numeric({ precision: 65, scale: 30 }),
// 	paymentPercentage: integer().default(0).notNull(),
// 	status: orderStatus().default('PENDING').notNull(),
// 	isAccepted: boolean().default(false).notNull(),
// 	invoiceUrl: text(),
// 	expectedDateOfArrival: timestamp({ precision: 3, mode: 'string' }).notNull(),
// 	requestedAt: timestamp({ precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
// 	acceptedAt: timestamp({ precision: 3, mode: 'string' }),
// 	deliveredAt: timestamp({ precision: 3, mode: 'string' }),
// 	updatedAt: timestamp({ precision: 3, mode: 'string' }).notNull(),
// 	supplierReviewNotes: text(),
// 	warehouseManagerReviewNotes: text(),
// }, (table) => [
// 	foreignKey({
// 		columns: [table.supplierId],
// 		foreignColumns: [supplier.supplierId],
// 		name: "PurchaseOrder_supplierId_fkey"
// 	}).onUpdate("cascade").onDelete("restrict"),
// 	foreignKey({
// 		columns: [table.warehouseId],
// 		foreignColumns: [warehouse.warehouseId],
// 		name: "PurchaseOrder_warehouseId_fkey"
// 	}).onUpdate("cascade").onDelete("restrict"),
// ]);

// export const purchaseOrderItems = pgTable("PurchaseOrderItems", {
// 	id: text().primaryKey().notNull(),
// 	purchaseOrderId: text().notNull(),
// 	productType: text().notNull(),
// 	plantId: text(),
// 	plantVariantId: text(),
// 	potCategoryId: text(),
// 	potVariantId: text(),
// 	unitsRequested: integer().notNull(),
// 	unitCostPrice: numeric({ precision: 65, scale: 30 }),
// 	totalCost: numeric({ precision: 65, scale: 30 }),
// 	status: orderStatus().default('PENDING').notNull(),
// 	createdAt: timestamp({ precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
// 	updatedAt: timestamp({ precision: 3, mode: 'string' }).notNull(),
// }, (table) => [
// 	foreignKey({
// 		columns: [table.purchaseOrderId],
// 		foreignColumns: [purchaseOrder.id],
// 		name: "PurchaseOrderItems_purchaseOrderId_fkey"
// 	}).onUpdate("cascade").onDelete("restrict"),
// 	foreignKey({
// 		columns: [table.plantId],
// 		foreignColumns: [plants.plantId],
// 		name: "PurchaseOrderItems_plantId_fkey"
// 	}).onUpdate("cascade").onDelete("set null"),
// 	foreignKey({
// 		columns: [table.plantVariantId],
// 		foreignColumns: [plantVariants.variantId],
// 		name: "PurchaseOrderItems_plantVariantId_fkey"
// 	}).onUpdate("cascade").onDelete("set null"),
// 	foreignKey({
// 		columns: [table.potCategoryId],
// 		foreignColumns: [potCategory.categoryId],
// 		name: "PurchaseOrderItems_potCategoryId_fkey"
// 	}).onUpdate("cascade").onDelete("set null"),
// 	foreignKey({
// 		columns: [table.potVariantId],
// 		foreignColumns: [potVariants.potVariantId],
// 		name: "PurchaseOrderItems_potVariantId_fkey"
// 	}).onUpdate("cascade").onDelete("set null"),
// ]);

// export const potDamagedProduct = pgTable("PotDamagedProduct", {
// 	damageId: text().primaryKey().notNull(),
// 	potCategoryId: text().notNull(),
// 	potVariantId: text(),
// 	warehouseId: text().notNull(),
// 	purchaseOrderId: text(),
// 	purchaseOrderItemId: text(),
// 	orderId: text(),
// 	potOrderItemId: text(),
// 	handledById: text().notNull(),
// 	damageType: damageType().notNull(),
// 	unitsDamaged: integer().notNull(),
// 	unitsDamagedPrice: numeric({ precision: 65, scale: 30 }).notNull(),
// 	totalAmount: numeric({ precision: 65, scale: 30 }).notNull(),
// 	reason: text().notNull(),
// 	notes: text(),
// 	handledBy: text().notNull(),
// 	reportDate: timestamp({ precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
// 	publicId: text().notNull(),
// 	mediaUrl: text().notNull(),
// 	createdAt: timestamp({ precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
// 	updatedAt: timestamp({ precision: 3, mode: 'string' }).notNull(),
// 	deletedAt: timestamp({ precision: 3, mode: 'string' }),
// }, (table) => [
// 	uniqueIndex("PotDamagedProduct_potOrderItemId_key").using("btree", table.potOrderItemId.asc().nullsLast().op("text_ops")),
// 	uniqueIndex("PotDamagedProduct_purchaseOrderItemId_key").using("btree", table.purchaseOrderItemId.asc().nullsLast().op("text_ops")),
// 	foreignKey({
// 		columns: [table.potCategoryId],
// 		foreignColumns: [potCategory.categoryId],
// 		name: "PotDamagedProduct_potCategoryId_fkey"
// 	}).onUpdate("cascade").onDelete("restrict"),
// 	foreignKey({
// 		columns: [table.potVariantId],
// 		foreignColumns: [potVariants.potVariantId],
// 		name: "PotDamagedProduct_potVariantId_fkey"
// 	}).onUpdate("cascade").onDelete("set null"),
// 	foreignKey({
// 		columns: [table.warehouseId],
// 		foreignColumns: [warehouse.warehouseId],
// 		name: "PotDamagedProduct_warehouseId_fkey"
// 	}).onUpdate("cascade").onDelete("restrict"),
// 	foreignKey({
// 		columns: [table.purchaseOrderId],
// 		foreignColumns: [purchaseOrder.id],
// 		name: "PotDamagedProduct_purchaseOrderId_fkey"
// 	}).onUpdate("cascade").onDelete("set null"),
// 	foreignKey({
// 		columns: [table.purchaseOrderItemId],
// 		foreignColumns: [purchaseOrderItems.id],
// 		name: "PotDamagedProduct_purchaseOrderItemId_fkey"
// 	}).onUpdate("cascade").onDelete("set null"),
// 	foreignKey({
// 		columns: [table.orderId],
// 		foreignColumns: [order.orderId],
// 		name: "PotDamagedProduct_orderId_fkey"
// 	}).onUpdate("cascade").onDelete("set null"),
// 	foreignKey({
// 		columns: [table.potOrderItemId],
// 		foreignColumns: [potOrderItem.orderItemId],
// 		name: "PotDamagedProduct_potOrderItemId_fkey"
// 	}).onUpdate("cascade").onDelete("set null"),
// ]);

// export const review = pgTable("Review", {
// 	reviewId: text().primaryKey().notNull(),
// 	plantId: text(),
// 	plantVariantId: text(),
// 	potCategoryId: text(),
// 	potVariantId: text(),
// 	customerId: text(),
// 	rating: integer().notNull(),
// 	reviewText: text(),
// 	reviewDate: timestamp({ precision: 3, mode: 'string' }).notNull(),
// 	isVerifiedCustomer: boolean().notNull(),
// 	createdAt: timestamp({ precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
// 	updatedAt: timestamp({ precision: 3, mode: 'string' }).notNull(),
// 	deletedAt: timestamp({ precision: 3, mode: 'string' }),
// }, (table) => [
// 	foreignKey({
// 		columns: [table.customerId],
// 		foreignColumns: [customer.customerId],
// 		name: "Review_customerId_fkey"
// 	}).onUpdate("cascade").onDelete("set null"),
// 	foreignKey({
// 		columns: [table.plantId],
// 		foreignColumns: [plants.plantId],
// 		name: "Review_plantId_fkey"
// 	}).onUpdate("cascade").onDelete("set null"),
// 	foreignKey({
// 		columns: [table.plantVariantId],
// 		foreignColumns: [plantVariants.variantId],
// 		name: "Review_plantVariantId_fkey"
// 	}).onUpdate("cascade").onDelete("set null"),
// 	foreignKey({
// 		columns: [table.potCategoryId],
// 		foreignColumns: [potCategory.categoryId],
// 		name: "Review_potCategoryId_fkey"
// 	}).onUpdate("cascade").onDelete("set null"),
// 	foreignKey({
// 		columns: [table.potVariantId],
// 		foreignColumns: [potVariants.potVariantId],
// 		name: "Review_potVariantId_fkey"
// 	}).onUpdate("cascade").onDelete("set null"),
// ]);

// export const reviewImage = pgTable("ReviewImage", {
// 	id: text().primaryKey().notNull(),
// 	reviewId: text().notNull(),
// 	publicId: text().notNull(),
// 	mediaUrl: text().notNull(),
// 	mediaType: text(),
// 	resourceType: text(),
// 	isPrimary: boolean().default(false).notNull(),
// 	createdAt: timestamp({ precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
// 	updatedAt: timestamp({ precision: 3, mode: 'string' }).notNull(),
// 	deletedAt: timestamp({ precision: 3, mode: 'string' }),
// }, (table) => [
// 	index("ReviewImage_reviewId_idx").using("btree", table.reviewId.asc().nullsLast().op("text_ops")),
// 	foreignKey({
// 		columns: [table.reviewId],
// 		foreignColumns: [review.reviewId],
// 		name: "ReviewImage_reviewId_fkey"
// 	}).onUpdate("cascade").onDelete("cascade"),
// ]);

// export const websiteAnalytics = pgTable("WebsiteAnalytics", {
// 	sessionId: text().primaryKey().notNull(),
// 	customerId: text().notNull(),
// 	pageVisited: text().notNull(),
// 	timeSpent: numeric({ precision: 65, scale: 30 }).notNull(),
// 	bounceRate: numeric({ precision: 65, scale: 30 }).notNull(),
// 	conversionRate: numeric({ precision: 65, scale: 30 }).notNull(),
// 	netSales: numeric({ precision: 65, scale: 30 }).notNull(),
// 	costTotal: numeric({ precision: 65, scale: 30 }).notNull(),
// 	createdAt: timestamp({ precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
// }, (table) => [
// 	foreignKey({
// 		columns: [table.customerId],
// 		foreignColumns: [customer.customerId],
// 		name: "WebsiteAnalytics_customerId_fkey"
// 	}).onUpdate("cascade").onDelete("restrict"),
// ]);

// export const plantSalesAnalytics = pgTable("PlantSalesAnalytics", {
// 	analyticsId: text().primaryKey().notNull(),
// 	plantId: text().notNull(),
// 	plantVariantId: text().notNull(),
// 	totalUnitsSold: integer().default(0).notNull(),
// 	totalUnitsReturned: integer().default(0).notNull(),
// 	averageSellingPrice: numeric({ precision: 65, scale: 30 }).default('0.0').notNull(),
// 	averageTrueCost: numeric({ precision: 65, scale: 30 }).default('0.0').notNull(),
// 	profitMargin: numeric({ precision: 65, scale: 30 }).default('0.0').notNull(),
// 	createdAt: timestamp({ precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
// 	updatedAt: timestamp({ precision: 3, mode: 'string' }).notNull(),
// 	deletedAt: timestamp({ precision: 3, mode: 'string' }),
// }, (table) => [
// 	foreignKey({
// 		columns: [table.plantId],
// 		foreignColumns: [plants.plantId],
// 		name: "PlantSalesAnalytics_plantId_fkey"
// 	}).onUpdate("cascade").onDelete("restrict"),
// 	foreignKey({
// 		columns: [table.plantVariantId],
// 		foreignColumns: [plantVariants.variantId],
// 		name: "PlantSalesAnalytics_plantVariantId_fkey"
// 	}).onUpdate("cascade").onDelete("restrict"),
// ]);

// export const potSalesAnalytics = pgTable("PotSalesAnalytics", {
// 	analyticsId: text().primaryKey().notNull(),
// 	potCategoryId: text().notNull(),
// 	potVariantId: text().notNull(),
// 	totalUnitsSold: integer().default(0).notNull(),
// 	totalUnitsReturned: integer().default(0).notNull(),
// 	averageSellingPrice: numeric({ precision: 65, scale: 30 }).default('0.0').notNull(),
// 	averageTrueCost: numeric({ precision: 65, scale: 30 }).default('0.0').notNull(),
// 	profitMargin: numeric({ precision: 65, scale: 30 }).default('0.0').notNull(),
// 	createdAt: timestamp({ precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
// 	updatedAt: timestamp({ precision: 3, mode: 'string' }).notNull(),
// 	deletedAt: timestamp({ precision: 3, mode: 'string' }),
// }, (table) => [
// 	foreignKey({
// 		columns: [table.potCategoryId],
// 		foreignColumns: [potCategory.categoryId],
// 		name: "PotSalesAnalytics_potCategoryId_fkey"
// 	}).onUpdate("cascade").onDelete("restrict"),
// 	foreignKey({
// 		columns: [table.potVariantId],
// 		foreignColumns: [potVariants.potVariantId],
// 		name: "PotSalesAnalytics_potVariantId_fkey"
// 	}).onUpdate("cascade").onDelete("restrict"),
// ]);

// export const plantWarehouseInventory = pgTable("PlantWarehouseInventory", {
// 	id: text().primaryKey().notNull(),
// 	plantId: text().notNull(),
// 	variantId: text().notNull(),
// 	warehouseId: text().notNull(),
// 	stockIn: integer().default(0),
// 	stockOut: integer().default(0),
// 	stockLossCount: integer().default(0),
// 	latestQuantityAdded: integer().default(0),
// 	currentStock: integer().default(0),
// 	reservedUnit: integer().default(0),
// 	totalCost: numeric({ precision: 65, scale: 30 }).default('0.0'),
// 	trueCostPrice: numeric({ precision: 65, scale: 30 }).default('0.0'),
// 	lastRestocked: timestamp({ precision: 3, mode: 'string' }).notNull(),
// 	createdAt: timestamp({ precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
// 	updatedAt: timestamp({ precision: 3, mode: 'string' }).notNull(),
// 	deletedAt: timestamp({ precision: 3, mode: 'string' }),
// }, (table) => [
// 	uniqueIndex("PlantWarehouseInventory_plantId_variantId_warehouseId_key").using("btree", table.plantId.asc().nullsLast().op("text_ops"), table.variantId.asc().nullsLast().op("text_ops"), table.warehouseId.asc().nullsLast().op("text_ops")),
// 	foreignKey({
// 		columns: [table.plantId],
// 		foreignColumns: [plants.plantId],
// 		name: "PlantWarehouseInventory_plantId_fkey"
// 	}).onUpdate("cascade").onDelete("restrict"),
// 	foreignKey({
// 		columns: [table.warehouseId],
// 		foreignColumns: [warehouse.warehouseId],
// 		name: "PlantWarehouseInventory_warehouseId_fkey"
// 	}).onUpdate("cascade").onDelete("restrict"),
// 	foreignKey({
// 		columns: [table.variantId],
// 		foreignColumns: [plantVariants.variantId],
// 		name: "PlantWarehouseInventory_variantId_fkey"
// 	}).onUpdate("cascade").onDelete("restrict"),
// ]);

// export const potWarehouseInventory = pgTable("PotWarehouseInventory", {
// 	id: text().primaryKey().notNull(),
// 	potCategoryId: text().notNull(),
// 	potVariantId: text().notNull(),
// 	warehouseId: text().notNull(),
// 	stockIn: integer().default(0),
// 	stockOut: integer().default(0),
// 	stockLossCount: integer().default(0),
// 	latestQuantityAdded: integer().default(0),
// 	currentStock: integer().default(0),
// 	reservedUnit: integer().default(0),
// 	totalCost: numeric({ precision: 65, scale: 30 }).default('0.0'),
// 	trueCostPrice: numeric({ precision: 65, scale: 30 }).default('0.0'),
// 	lastRestocked: timestamp({ precision: 3, mode: 'string' }).notNull(),
// 	createdAt: timestamp({ precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
// 	updatedAt: timestamp({ precision: 3, mode: 'string' }).notNull(),
// 	deletedAt: timestamp({ precision: 3, mode: 'string' }),
// }, (table) => [
// 	uniqueIndex("PotWarehouseInventory_potCategoryId_potVariantId_warehouseI_key").using("btree", table.potCategoryId.asc().nullsLast().op("text_ops"), table.potVariantId.asc().nullsLast().op("text_ops"), table.warehouseId.asc().nullsLast().op("text_ops")),
// 	foreignKey({
// 		columns: [table.potVariantId],
// 		foreignColumns: [potVariants.potVariantId],
// 		name: "PotWarehouseInventory_potVariantId_fkey"
// 	}).onUpdate("cascade").onDelete("restrict"),
// 	foreignKey({
// 		columns: [table.potCategoryId],
// 		foreignColumns: [potCategory.categoryId],
// 		name: "PotWarehouseInventory_potCategoryId_fkey"
// 	}).onUpdate("cascade").onDelete("restrict"),
// 	foreignKey({
// 		columns: [table.warehouseId],
// 		foreignColumns: [warehouse.warehouseId],
// 		name: "PotWarehouseInventory_warehouseId_fkey"
// 	}).onUpdate("cascade").onDelete("restrict"),
// ]);

// export const plantRestockEventLog = pgTable("PlantRestockEventLog", {
// 	restockId: text().primaryKey().notNull(),
// 	supplierId: text().notNull(),
// 	plantId: text().notNull(),
// 	plantVariantId: text().notNull(),
// 	warehouseId: text().notNull(),
// 	purchaseOrderId: text().notNull(),
// 	units: integer().notNull(),
// 	unitCostPrice: numeric({ precision: 65, scale: 30 }).notNull(),
// 	totalCost: numeric({ precision: 65, scale: 30 }).notNull(),
// 	restockDate: timestamp({ precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
// }, (table) => [
// 	foreignKey({
// 		columns: [table.plantId],
// 		foreignColumns: [plants.plantId],
// 		name: "PlantRestockEventLog_plantId_fkey"
// 	}).onUpdate("cascade").onDelete("restrict"),
// 	foreignKey({
// 		columns: [table.plantVariantId],
// 		foreignColumns: [plantVariants.variantId],
// 		name: "PlantRestockEventLog_plantVariantId_fkey"
// 	}).onUpdate("cascade").onDelete("restrict"),
// 	foreignKey({
// 		columns: [table.supplierId],
// 		foreignColumns: [supplier.supplierId],
// 		name: "PlantRestockEventLog_supplierId_fkey"
// 	}).onUpdate("cascade").onDelete("restrict"),
// 	foreignKey({
// 		columns: [table.warehouseId],
// 		foreignColumns: [warehouse.warehouseId],
// 		name: "PlantRestockEventLog_warehouseId_fkey"
// 	}).onUpdate("cascade").onDelete("restrict"),
// 	foreignKey({
// 		columns: [table.purchaseOrderId],
// 		foreignColumns: [purchaseOrder.id],
// 		name: "PlantRestockEventLog_purchaseOrderId_fkey"
// 	}).onUpdate("cascade").onDelete("restrict"),
// ]);

// export const potRestockEventLog = pgTable("PotRestockEventLog", {
// 	restockId: text().primaryKey().notNull(),
// 	supplierId: text().notNull(),
// 	potVariantId: text().notNull(),
// 	potCategoryId: text().notNull(),
// 	warehouseId: text().notNull(),
// 	purchaseOrderId: text().notNull(),
// 	units: integer().notNull(),
// 	unitCostPrice: numeric({ precision: 65, scale: 30 }).notNull(),
// 	totalCost: numeric({ precision: 65, scale: 30 }).notNull(),
// 	restockDate: timestamp({ precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
// }, (table) => [
// 	foreignKey({
// 		columns: [table.potVariantId],
// 		foreignColumns: [potVariants.potVariantId],
// 		name: "PotRestockEventLog_potVariantId_fkey"
// 	}).onUpdate("cascade").onDelete("restrict"),
// 	foreignKey({
// 		columns: [table.potCategoryId],
// 		foreignColumns: [potCategory.categoryId],
// 		name: "PotRestockEventLog_potCategoryId_fkey"
// 	}).onUpdate("cascade").onDelete("restrict"),
// 	foreignKey({
// 		columns: [table.supplierId],
// 		foreignColumns: [supplier.supplierId],
// 		name: "PotRestockEventLog_supplierId_fkey"
// 	}).onUpdate("cascade").onDelete("restrict"),
// 	foreignKey({
// 		columns: [table.warehouseId],
// 		foreignColumns: [warehouse.warehouseId],
// 		name: "PotRestockEventLog_warehouseId_fkey"
// 	}).onUpdate("cascade").onDelete("restrict"),
// 	foreignKey({
// 		columns: [table.purchaseOrderId],
// 		foreignColumns: [purchaseOrder.id],
// 		name: "PotRestockEventLog_purchaseOrderId_fkey"
// 	}).onUpdate("cascade").onDelete("restrict"),
// ]);

// export const warehouseCartItem = pgTable("WarehouseCartItem", {
// 	cartItemId: text().primaryKey().notNull(),
// 	warehouseId: text().notNull(),
// 	supplierId: text().notNull(),
// 	plantId: text(),
// 	plantVariantId: text(),
// 	potCategoryId: text(),
// 	potVariantId: text(),
// 	productType: text().notNull(),
// 	unitsRequested: integer().default(1).notNull(),
// 	unitCostPrice: numeric({ precision: 65, scale: 30 }),
// 	addedAt: timestamp({ precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
// 	updatedAt: timestamp({ precision: 3, mode: 'string' }).notNull(),
// 	deletedAt: timestamp({ precision: 3, mode: 'string' }),
// }, (table) => [
// 	uniqueIndex("WarehouseCartItem_warehouseId_supplierId_plantId_plantVaria_key").using("btree", table.warehouseId.asc().nullsLast().op("text_ops"), table.supplierId.asc().nullsLast().op("text_ops"), table.plantId.asc().nullsLast().op("text_ops"), table.plantVariantId.asc().nullsLast().op("text_ops")),
// 	uniqueIndex("WarehouseCartItem_warehouseId_supplierId_potCategoryId_potV_key").using("btree", table.warehouseId.asc().nullsLast().op("text_ops"), table.supplierId.asc().nullsLast().op("text_ops"), table.potCategoryId.asc().nullsLast().op("text_ops"), table.potVariantId.asc().nullsLast().op("text_ops")),
// 	foreignKey({
// 		columns: [table.warehouseId],
// 		foreignColumns: [warehouse.warehouseId],
// 		name: "WarehouseCartItem_warehouseId_fkey"
// 	}).onUpdate("cascade").onDelete("restrict"),
// 	foreignKey({
// 		columns: [table.supplierId],
// 		foreignColumns: [supplier.supplierId],
// 		name: "WarehouseCartItem_supplierId_fkey"
// 	}).onUpdate("cascade").onDelete("restrict"),
// 	foreignKey({
// 		columns: [table.plantId],
// 		foreignColumns: [plants.plantId],
// 		name: "WarehouseCartItem_plantId_fkey"
// 	}).onUpdate("cascade").onDelete("set null"),
// 	foreignKey({
// 		columns: [table.plantVariantId],
// 		foreignColumns: [plantVariants.variantId],
// 		name: "WarehouseCartItem_plantVariantId_fkey"
// 	}).onUpdate("cascade").onDelete("set null"),
// 	foreignKey({
// 		columns: [table.potCategoryId],
// 		foreignColumns: [potCategory.categoryId],
// 		name: "WarehouseCartItem_potCategoryId_fkey"
// 	}).onUpdate("cascade").onDelete("set null"),
// 	foreignKey({
// 		columns: [table.potVariantId],
// 		foreignColumns: [potVariants.potVariantId],
// 		name: "WarehouseCartItem_potVariantId_fkey"
// 	}).onUpdate("cascade").onDelete("set null"),
// ]);

// export const purchaseOrderPayment = pgTable("PurchaseOrderPayment", {
// 	paymentId: text().primaryKey().notNull(),
// 	orderId: text().notNull(),
// 	paidBy: text().notNull(),
// 	amount: numeric({ precision: 65, scale: 30 }).notNull(),
// 	status: text().default('PENDING').notNull(),
// 	paymentMethod: text().notNull(),
// 	transactionId: text(),
// 	remarks: text(),
// 	receiptUrl: text(),
// 	publicId: text(),
// 	resourceType: text(),
// 	requestedAt: timestamp({ precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
// 	paidAt: timestamp({ precision: 3, mode: 'string' }),
// }, (table) => [
// 	foreignKey({
// 		columns: [table.orderId],
// 		foreignColumns: [purchaseOrder.id],
// 		name: "PurchaseOrderPayment_orderId_fkey"
// 	}).onUpdate("cascade").onDelete("restrict"),
// ]);

// export const purchaseOrderMedia = pgTable("PurchaseOrderMedia", {
// 	id: text().primaryKey().notNull(),
// 	purchaseOrderId: text().notNull(),
// 	uploadedBy: text().notNull(),
// 	publicId: text().notNull(),
// 	mediaUrl: text().notNull(),
// 	mediaType: text().notNull(),
// 	resourceType: text(),
// 	isPrimary: boolean().default(false).notNull(),
// 	createdAt: timestamp({ precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
// 	updatedAt: timestamp({ precision: 3, mode: 'string' }).notNull(),
// 	deletedAt: timestamp({ precision: 3, mode: 'string' }),
// }, (table) => [
// 	index("PurchaseOrderMedia_purchaseOrderId_idx").using("btree", table.purchaseOrderId.asc().nullsLast().op("text_ops")),
// 	foreignKey({
// 		columns: [table.purchaseOrderId],
// 		foreignColumns: [purchaseOrder.id],
// 		name: "PurchaseOrderMedia_purchaseOrderId_fkey"
// 	}).onUpdate("cascade").onDelete("cascade"),
// ]);

// export const plantSupplierInventory = pgTable("PlantSupplierInventory", {
// 	supplierInventoryId: text().primaryKey().notNull(),
// 	supplierId: text().notNull(),
// 	plantId: text().notNull(),
// 	plantVariantId: text(),
// 	stockIn: integer().notNull(),
// 	stockOut: integer().notNull(),
// 	stockAdjustment: integer().notNull(),
// 	currentStock: integer().notNull(),
// 	reorderLevel: integer().notNull(),
// 	lastRestocked: timestamp({ precision: 3, mode: 'string' }).notNull(),
// 	createdAt: timestamp({ precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
// 	updatedAt: timestamp({ precision: 3, mode: 'string' }).notNull(),
// 	deletedAt: timestamp({ precision: 3, mode: 'string' }),
// }, (table) => [
// 	foreignKey({
// 		columns: [table.supplierId],
// 		foreignColumns: [supplier.supplierId],
// 		name: "PlantSupplierInventory_supplierId_fkey"
// 	}).onUpdate("cascade").onDelete("restrict"),
// 	foreignKey({
// 		columns: [table.plantId],
// 		foreignColumns: [plants.plantId],
// 		name: "PlantSupplierInventory_plantId_fkey"
// 	}).onUpdate("cascade").onDelete("restrict"),
// 	foreignKey({
// 		columns: [table.plantVariantId],
// 		foreignColumns: [plantVariants.variantId],
// 		name: "PlantSupplierInventory_plantVariantId_fkey"
// 	}).onUpdate("cascade").onDelete("set null"),
// ]);

// export const potSupplierInventory = pgTable("PotSupplierInventory", {
// 	supplierInventoryId: text().primaryKey().notNull(),
// 	supplierId: text().notNull(),
// 	potCategoryId: text().notNull(),
// 	potVariantId: text(),
// 	stockIn: integer().notNull(),
// 	stockOut: integer().notNull(),
// 	stockAdjustment: integer().notNull(),
// 	currentStock: integer().notNull(),
// 	reorderLevel: integer().notNull(),
// 	lastRestocked: timestamp({ precision: 3, mode: 'string' }).notNull(),
// 	createdAt: timestamp({ precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
// 	updatedAt: timestamp({ precision: 3, mode: 'string' }).notNull(),
// 	deletedAt: timestamp({ precision: 3, mode: 'string' }),
// }, (table) => [
// 	foreignKey({
// 		columns: [table.supplierId],
// 		foreignColumns: [supplier.supplierId],
// 		name: "PotSupplierInventory_supplierId_fkey"
// 	}).onUpdate("cascade").onDelete("restrict"),
// 	foreignKey({
// 		columns: [table.potCategoryId],
// 		foreignColumns: [potCategory.categoryId],
// 		name: "PotSupplierInventory_potCategoryId_fkey"
// 	}).onUpdate("cascade").onDelete("restrict"),
// 	foreignKey({
// 		columns: [table.potVariantId],
// 		foreignColumns: [potVariants.potVariantId],
// 		name: "PotSupplierInventory_potVariantId_fkey"
// 	}).onUpdate("cascade").onDelete("set null"),
// ]);

// export const emailVerification = pgTable("EmailVerification", {
// 	id: text().primaryKey().notNull(),
// 	userId: text(),
// 	email: text().notNull(),
// 	token: text().notNull(),
// 	expiresAt: timestamp({ precision: 3, mode: 'string' }).notNull(),
// 	verified: boolean().default(false).notNull(),
// 	verifiedAt: timestamp({ precision: 3, mode: 'string' }),
// 	createdAt: timestamp({ precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
// 	updatedAt: timestamp({ precision: 3, mode: 'string' }).notNull(),
// }, (table) => [
// 	index("EmailVerification_email_idx").using("btree", table.email.asc().nullsLast().op("text_ops")),
// 	index("EmailVerification_userId_idx").using("btree", table.userId.asc().nullsLast().op("text_ops")),
// 	foreignKey({
// 		columns: [table.userId],
// 		foreignColumns: [user.userId],
// 		name: "EmailVerification_userId_fkey"
// 	}).onUpdate("cascade").onDelete("set null"),
// ]);

// export const phoneVerification = pgTable("PhoneVerification", {
// 	id: text().primaryKey().notNull(),
// 	userId: text(),
// 	phoneNumber: text().notNull(),
// 	otp: text().notNull(),
// 	expiresAt: timestamp({ precision: 3, mode: 'string' }).notNull(),
// 	verified: boolean().default(false).notNull(),
// 	verifiedAt: timestamp({ precision: 3, mode: 'string' }),
// 	createdAt: timestamp({ precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
// 	updatedAt: timestamp({ precision: 3, mode: 'string' }).notNull(),
// }, (table) => [
// 	index("PhoneVerification_phoneNumber_idx").using("btree", table.phoneNumber.asc().nullsLast().op("text_ops")),
// 	index("PhoneVerification_userId_idx").using("btree", table.userId.asc().nullsLast().op("text_ops")),
// 	foreignKey({
// 		columns: [table.userId],
// 		foreignColumns: [user.userId],
// 		name: "PhoneVerification_userId_fkey"
// 	}).onUpdate("cascade").onDelete("set null"),
// ]);

// export const rolePermission = pgTable("RolePermission", {
// 	roleId: text().notNull(),
// 	permissionId: text().notNull(),
// 	addedByUserId: text(),
// 	addedByType: addedByType().default('SYSTEM').notNull(),
// 	reason: text(),
// }, (table) => [
// 	foreignKey({
// 		columns: [table.roleId],
// 		foreignColumns: [role.roleId],
// 		name: "RolePermission_roleId_fkey"
// 	}).onUpdate("cascade").onDelete("restrict"),
// 	foreignKey({
// 		columns: [table.permissionId],
// 		foreignColumns: [permission.permissionId],
// 		name: "RolePermission_permissionId_fkey"
// 	}).onUpdate("cascade").onDelete("restrict"),
// 	foreignKey({
// 		columns: [table.addedByUserId],
// 		foreignColumns: [user.userId],
// 		name: "RolePermission_addedByUserId_fkey"
// 	}).onUpdate("cascade").onDelete("set null"),
// 	primaryKey({ columns: [table.roleId, table.permissionId], name: "RolePermission_pkey" }),
// ]);

// export const userGroup = pgTable("UserGroup", {
// 	userId: text().notNull(),
// 	groupId: text().notNull(),
// 	createdAt: timestamp({ precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
// 	updatedAt: timestamp({ precision: 3, mode: 'string' }).notNull(),
// 	deletedAt: timestamp({ precision: 3, mode: 'string' }),
// }, (table) => [
// 	index("UserGroup_groupId_idx").using("btree", table.groupId.asc().nullsLast().op("text_ops")),
// 	foreignKey({
// 		columns: [table.userId],
// 		foreignColumns: [user.userId],
// 		name: "UserGroup_userId_fkey"
// 	}).onUpdate("cascade").onDelete("restrict"),
// 	foreignKey({
// 		columns: [table.groupId],
// 		foreignColumns: [group.groupId],
// 		name: "UserGroup_groupId_fkey"
// 	}).onUpdate("cascade").onDelete("restrict"),
// 	primaryKey({ columns: [table.userId, table.groupId], name: "UserGroup_pkey" }),
// ]);

// export const groupRole = pgTable("GroupRole", {
// 	groupId: text().notNull(),
// 	roleId: text().notNull(),
// 	createdAt: timestamp({ precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
// 	updatedAt: timestamp({ precision: 3, mode: 'string' }).notNull(),
// 	deletedAt: timestamp({ precision: 3, mode: 'string' }),
// }, (table) => [
// 	foreignKey({
// 		columns: [table.groupId],
// 		foreignColumns: [group.groupId],
// 		name: "GroupRole_groupId_fkey"
// 	}).onUpdate("cascade").onDelete("restrict"),
// 	foreignKey({
// 		columns: [table.roleId],
// 		foreignColumns: [role.roleId],
// 		name: "GroupRole_roleId_fkey"
// 	}).onUpdate("cascade").onDelete("restrict"),
// 	primaryKey({ columns: [table.groupId, table.roleId], name: "GroupRole_pkey" }),
// ]);

// export const userPermission = pgTable("UserPermission", {
// 	userId: text().notNull(),
// 	permissionId: text().notNull(),
// 	allowed: boolean().notNull(),
// 	addedByUserId: text(),
// 	addedByType: addedByType().default('SYSTEM').notNull(),
// 	reason: text(),
// }, (table) => [
// 	foreignKey({
// 		columns: [table.userId],
// 		foreignColumns: [user.userId],
// 		name: "UserPermission_userId_fkey"
// 	}).onUpdate("cascade").onDelete("restrict"),
// 	foreignKey({
// 		columns: [table.permissionId],
// 		foreignColumns: [permission.permissionId],
// 		name: "UserPermission_permissionId_fkey"
// 	}).onUpdate("cascade").onDelete("restrict"),
// 	foreignKey({
// 		columns: [table.addedByUserId],
// 		foreignColumns: [user.userId],
// 		name: "UserPermission_addedByUserId_fkey"
// 	}).onUpdate("cascade").onDelete("set null"),
// 	primaryKey({ columns: [table.userId, table.permissionId], name: "UserPermission_pkey" }),
// ]);
