import { password } from 'bun';

export const hashPassword = async (plainPassword: string): Promise<string> => {
  return password.hash(plainPassword);
};

export const comparePassword = async (plainPassword: string, hash: string): Promise<boolean> => {
  return password.verify(plainPassword, hash);
};