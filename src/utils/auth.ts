import { password } from 'bun';
import { AuthenticatedUser } from '../middleware/auth';

export const hashPassword = async (plainPassword: string): Promise<string> => {
  return password.hash(plainPassword);
};

export const comparePassword = async (plainPassword: string, hash: string): Promise<boolean> => {
  return password.verify(plainPassword, hash);
};


export function TestME() {
  console.log("yep tested");

}