import { userTable } from "db/schemas/user.schema";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import z from "zod";




export const UserInsertSchema = createInsertSchema(userTable);
export const UserSelectSchema = createSelectSchema(userTable);

export const UserRouteCreateSchema = UserInsertSchema.pick({ email: true, password: true, fullName: true, });

export const UserRouteUpdateSchema = UserRouteCreateSchema.partial().extend({ userId: UserInsertSchema.shape.userId, });

export const UserRouteLoginReq = UserSelectSchema.pick({ email: true, password: true })
export const UserRouteLoginReply = z.object({
  token: z.string(),
  user: UserSelectSchema.pick({ email: true, fullName: true, phoneNumber: true, profileImageUrl: true })
})

export type TUserRouteCreate = z.infer<typeof UserRouteCreateSchema>
export type TUserRouteLogin = z.infer<typeof UserRouteLoginReq>