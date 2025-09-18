import { sql } from "drizzle-orm";
import { pgTable, serial, text, timestamp, uniqueIndex } from "drizzle-orm/pg-core";


export const plantCategory = pgTable("plant_category",{
    id: serial("id").primaryKey().notNull(),
    name: text().notNull(),
    description: text().default(""),
    publicId: text().notNull(),
    mediaUrl: text(),
    createdAt: timestamp({ precision: 3, mode: "string" }).default(sql`CURRENT_TIMESTAMP`).notNull(),
    updatedAt: timestamp({ precision: 3, mode: "string" }).default(sql`CURRENT_TIMESTAMP`).notNull(),
    deletedAt: timestamp({ precision: 3, mode: "string" }),
  },
  (table) => [
    uniqueIndex("plant_category_name_key").on(table.name),
    uniqueIndex("plant_category_public_id_key").on(table.publicId),
  ]
);
