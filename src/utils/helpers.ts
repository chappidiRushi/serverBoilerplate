import crypto from 'crypto';

export const generateRequestId = (): string => {
  return `REQ_${crypto.randomBytes(8).toString('hex')}`;
};

export const sleep = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const sanitizeUser = (user: any) => {
  const { password, ...sanitized } = user;
  return sanitized;
};