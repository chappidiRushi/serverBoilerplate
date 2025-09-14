import { sql } from "drizzle-orm";
import { boolean, index, jsonb, pgTable, text, timestamp, uniqueIndex } from "drizzle-orm/pg-core";


export const userTable = pgTable("user", {
  userId: text().primaryKey().notNull(),
  // roleId: text().notNull(),
  fullName: text().notNull(),
  phoneNumber: text(),
  email: text().notNull(),
  password: text().notNull(),
  isActive: boolean().default(true).notNull(),
  profileImageUrl: text(),
  publicId: text(),
  phoneVerified: boolean().default(false).notNull(),
  emailVerified: boolean().default(false).notNull(),
  address: jsonb(),
  deactivationReason: text(),
  createdAt: timestamp({ precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
  updatedAt: timestamp({ precision: 3, mode: 'string' }).notNull(),
  deletedAt: timestamp({ precision: 3, mode: 'string' }),
}, (table) => [
  uniqueIndex("User_email_key").using("btree", table.email.asc().nullsLast().op("text_ops")),
  index("User_phoneNumber_email_idx").using("btree", table.phoneNumber.asc().nullsLast().op("text_ops"), table.email.asc().nullsLast().op("text_ops")),
  uniqueIndex("User_phoneNumber_key").using("btree", table.phoneNumber.asc().nullsLast().op("text_ops")),
  index("User_userId_idx").using("btree", table.userId.asc().nullsLast().op("text_ops")),
  // foreignKey({
  // 	columns: [table.roleId],
  // 	foreignColumns: [role.roleId],
  // 	name: "User_roleId_fkey"
  // }).onUpdate("cascade").onDelete("restrict"),
])
