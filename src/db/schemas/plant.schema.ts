import { sql } from "drizzle-orm";
import { boolean, index, integer, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";




export const plantTable = pgTable(
  "Plants",
  {
    id: serial("id").primaryKey().notNull(),
    name: text("name").notNull(),
    scientificName: text("scientificName"),
    description: text("description").notNull(),
    isProductActive: boolean("isProductActive").default(true).notNull(),
    isFeatured: boolean("isFeatured").notNull(),
    plantClass: text("plantClass"),
    plantSeries: text("plantSeries"),
    placeOfOrigin: text("placeOfOrigin"),
    auraType: text("auraType"),
    biodiversityBooster: boolean("biodiversityBooster"),
    carbonAbsorber: boolean("carbonAbsorber"),
    minimumTemperature: integer("minimumTemperature"),
    maximumTemperature: integer("maximumTemperature"),
    soil: text("soil"),
    repotting: text("repotting"),
    maintenance: text("maintenance"),

    // ✅ Array columns with proper defaults
    insideBox:  text('insideBox').array().notNull(),
    benefits: text("benefits").array(),
    spiritualUseCase: text("spiritualUseCase").array(),
    bestForEmotion: text("bestForEmotion").array(),
    bestGiftFor: text("bestGiftFor").array(),
    funFacts: text("funFacts").array(),
    associatedDeity: text("associatedDeity").array(),
    godAligned: text("godAligned").array(),

    // ✅ Timestamps
    createdAt: timestamp("createdAt", { precision: 3, withTimezone: true }).default(sql`CURRENT_TIMESTAMP`).notNull(),
    updatedAt: timestamp("updatedAt", { precision: 3, withTimezone: true }).default(sql`CURRENT_TIMESTAMP`).notNull(),
    deletedAt: timestamp("deletedAt", { precision: 3, withTimezone: true }),
  },
  (table) => [
    index("Plants_isFeatured_idx").using("btree", table.isFeatured.asc().nullsLast().op("bool_ops")),
    index("Plants_isProductActive_idx").using("btree", table.isProductActive.asc().nullsLast().op("bool_ops")),
    index("Plants_name_idx").using("btree", table.name.asc().nullsLast().op("text_ops")),
  ]
);
