import { TUserRouteCreateSchema } from "@validators/user.validator";
import { eq } from 'drizzle-orm';
import { userTable } from "../db/schemas/schema";
import { hashPassword } from "../utils/auth";


export const createUser = async function (payload: TUserRouteCreateSchema) {

  // Check if user already exists
  const { email, fullName, password } = payload
  const existingUser = await db
    .select()
    .from(userTable)
    .where(eq(userTable.email, email))
    .limit(1);

  if (existingUser.length > 0) {
    throw CE.BAD_REQUEST_400("User With Email Already Exists")
  }

  // Hash password
  const hashedPassword = await hashPassword(password);

  // Create user
  const [newUser] = await db
    .insert(userTable)
    .values({
      userId: crypto.randomUUID(),
      fullName,
      email,
      password: hashedPassword,
      updatedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      // Optional fields:
      // phoneNumber: "1231231231",
      // isActive: true,               // defaults to true
      // profileImageUrl: null,
      // publicId: crypto.randomUUID(),
      // phoneVerified: true,          // defaults to false
      // emailVerified: true,          // defaults to false
      // address: sql`${JSON.stringify({ add: "home" })}::jsonb`,
      // deactivationReason: null,
      // deletedAt: null,
    }).returning()

  if (!newUser) throw CE.INTERNAL_SERVER_ERROR_500("Failed To Create User.")
  return newUser;
}