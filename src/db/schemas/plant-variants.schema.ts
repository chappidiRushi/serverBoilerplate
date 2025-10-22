import { colorTable } from "@db/schemas/color.schema";
import { plantSizeProfile } from "@db/schemas/schema";
import { sql } from "drizzle-orm";
import { boolean, foreignKey, numeric, pgTable, serial, text, timestamp, uniqueIndex, uuid } from "drizzle-orm/pg-core";
import { plantTable } from "./plant.schema";


export const plantVariants = pgTable("plant_variants", {
	id: serial("id").primaryKey().notNull(),
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
		foreignColumns: [plantTable.id],
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
