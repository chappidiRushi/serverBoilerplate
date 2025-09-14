import { sql } from "drizzle-orm";
import { pgTable, text, timestamp, uniqueIndex } from "drizzle-orm/pg-core";


export const colorTable = pgTable("color", {
  id: text().primaryKey().notNull(),
  name: text().notNull(),
  hexCode: text().default('#FFFFFF').notNull(),
  createdAt: timestamp({ precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
  updatedAt: timestamp({ precision: 3, mode: 'string' }).notNull(),
  deletedAt: timestamp({ precision: 3, mode: 'string' }),
}, (table) => [
  uniqueIndex("Color_name_key").using("btree", table.name.asc().nullsLast().op("text_ops")),
])
