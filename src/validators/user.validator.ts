import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { userTable } from "../db/schemas/schema";
import z from "zod";

// Base schemas
export const UserInsertSchema = createInsertSchema(userTable);
export const UserSelectSchema = createSelectSchema(userTable);

export const UserRouteCreateSchema = UserInsertSchema.pick({
  email: true,
  password: true,
  fullName: true,
});

export const UserRouteUpdateSchema = UserRouteCreateSchema.partial().extend({
  userId: UserInsertSchema.shape.userId, // force required again
});


export type TUserRouteCreateSchema= z.infer<typeof UserRouteCreateSchema>