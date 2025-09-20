import { sql } from "drizzle-orm";
import { pgTable, serial, text, timestamp, uniqueIndex } from "drizzle-orm/pg-core";


export const colorTable = pgTable("color", {
  id: serial("id").primaryKey().notNull(),
  name: text().notNull(),
  hexCode: text().default("#FFFFFF").notNull(),
  createdAt: timestamp({ precision: 3, withTimezone: true, mode: "date" })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp({ precision: 3, withTimezone: true, mode: "date" })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  deletedAt: timestamp({ precision: 3, withTimezone: true, mode: "date" }),
},
  (table) => [
    uniqueIndex("color_name_key").on(table.name),
  ]
);