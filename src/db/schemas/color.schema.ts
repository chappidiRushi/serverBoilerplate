import { sql } from "drizzle-orm";
import { pgTable, text, timestamp, uniqueIndex, uuid } from "drizzle-orm/pg-core";


export const colorTable = pgTable("color", {
  id: uuid("id").defaultRandom().primaryKey(), // auto-generate UUID
  name: text().notNull(),
  hexCode: text().default("#FFFFFF").notNull(),
  createdAt: timestamp("created_at", { precision: 3, mode: "string" })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updated_at", { precision: 3, mode: "string" })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  deletedAt: timestamp("deleted_at", { precision: 3, mode: "string" }),
}, (table) => [
  uniqueIndex("color_name_key").using("btree", table.name.asc().nullsLast().op("text_ops")),
]);