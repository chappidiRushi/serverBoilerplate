// import { password } from 'bun';
// import type { AuthenticatedUser } from '../middleware/auth';

// export const hashPassword = async (plainPassword: string): Promise<string> => {
//   return password.hash(plainPassword);
// };

// export const comparePassword = async (plainPassword: string, hash: string): Promise<boolean> => {
//   return password.verify(plainPassword, hash);
// };

// export const generateJWTPayload = (user: {
//   id: number;
//   email: string;
//   firstName?: string | null;
//   lastName?: string | null;
// }): AuthenticatedUser => ({
//   id: user.id,
//   email: user.email,
//   firstName: user.firstName || undefined,
//   lastName: user.lastName || undefined,
// });




export function TestME() {
  console.log("yep tested");

}