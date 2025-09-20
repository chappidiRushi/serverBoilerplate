import { sql } from "drizzle-orm";
import { boolean, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";


export const FertilizerTable = pgTable("Fertilizers", {
  id:  serial("id").primaryKey().notNull(),
  name: text().notNull(),
  type: text().notNull(),
  composition: text().notNull(),
  description: text(),
  caution: text(),
  isEcoFriendly: boolean().notNull(),
  createdAt: timestamp({ precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
  updatedAt: timestamp({ precision: 3, mode: 'string' }).notNull(),
  deletedAt: timestamp({ precision: 3, mode: 'string' }),
});
