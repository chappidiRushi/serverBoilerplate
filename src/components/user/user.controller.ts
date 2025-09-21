import { TUserRouteCreate, TUserRouteLogin } from "components/user/user.validator";
import { userTable } from "db/schemas/user.schema";
import { eq } from 'drizzle-orm';
import { comparePassword, hashPassword } from "../../utils/auth.util";

export const UserCreate = async function (payload: TUserRouteCreate) {
  const { email, fullName, password } = payload
  const existingUser = await db
    .select()
    .from(userTable)
    .where(eq(userTable.email, email))
    .limit(1);

  if (existingUser.length > 0) throw CE.BAD_REQUEST_400("User With Email Already Exists")

  const hashedPassword = await hashPassword(password);

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

export const UserLogin = async function (payload: TUserRouteLogin, jwt: any) {
  const { email, password } = payload
  const [user] = await db
    .select()
    .from(userTable)
    .where(eq(userTable.email, email))
    .limit(1);
  if (!user) throw CE.BAD_REQUEST_400(`No User With Email:${email} Found`)

  const isValidPassword = await comparePassword(password, user.password);
  if (!isValidPassword) throw CE.BAD_REQUEST_400("Invalid Password");

  const jwtPayload = {
    userId: user.userId,
    email: user.email,
  };
  
  const token = await jwt.sign(jwtPayload);
  if (!token) throw CE.INTERNAL_SERVER_ERROR_500("Failed To Generate Token");
  
  return {
    token,
    user,
  }
}