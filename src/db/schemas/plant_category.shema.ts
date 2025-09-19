import { sql } from "drizzle-orm";
import { pgTable, serial, text, timestamp, uniqueIndex } from "drizzle-orm/pg-core";


export const plantCategoryTable = pgTable("plant_category", {
  id: serial("id").primaryKey().notNull(),
  name: text().notNull(),
  description: text().default(""),
  publicId: text().notNull(),
  mediaUrl: text(),
  createdAt: timestamp({ precision: 3, withTimezone: true, mode: "date" })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp({ precision: 3, withTimezone: true, mode: "date" })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  deletedAt: timestamp({ precision: 3, withTimezone: true, mode: "date" }),
},
  (table) => [
    uniqueIndex("plant_category_name_key").on(table.name),
    uniqueIndex("plant_category_public_id_key").on(table.publicId),
  ]
);


// To ensure ISO 8601 format, you can convert the string timestamps to ISO strings in your application code when reading from the database, e.g.:
// new Date(row.createdAt).toISOString()
