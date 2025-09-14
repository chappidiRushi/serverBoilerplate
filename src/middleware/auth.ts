// import type { FastifyReply, FastifyRequest } from 'fastify';
// import { Errors } from '../types/errors';

export interface AuthenticatedUser {
  id: number;
  email: string;
  firstName?: string;
  lastName?: string;
}

declare module 'fastify' {
  interface FastifyRequest {
    user?: AuthenticatedUser;
    requestId?: string;
  }
}

// export const authenticate = async (request: FastifyRequest, reply: FastifyReply) => {
//   const token = request.headers.authorization?.replace('Bearer ', '');

//   if (!token) {
//     throw new Errors.AuthenticationError('No token provided');
//   }

//   try {
//     const decoded = await request.server.jwt.verify(token) as AuthenticatedUser;
//     request.user = decoded;
//   } catch (err) {
//     throw new Errors.AuthenticationError('Invalid or expired token');
//   }
// };

// export const optionalAuth = async (request: FastifyRequest, reply: FastifyReply) => {
//   try {
//     const token = request.headers.authorization?.replace('Bearer ', '');

//     if (token) {
//       const decoded = await request.server.jwt.verify(token) as AuthenticatedUser;
//       request.user = decoded;
//     }
//   } catch (err) {
//     // Optional auth - continue without user
//   }
// };