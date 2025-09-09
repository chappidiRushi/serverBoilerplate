import type { FastifyRequest, FastifyReply } from 'fastify';
import { HTTP_STATUS, MESSAGES } from '../config/constants';

export interface AuthenticatedUser {
  id: number;
  email: string;
  firstName?: string;
  lastName?: string;
}

declare module 'fastify' {
  export interface FastifyRequest {
    user?: AuthenticatedUser;
  }
}

export const authenticate = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const token = request.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return reply.status(HTTP_STATUS.UNAUTHORIZED).send({
        error: MESSAGES.ERROR.UNAUTHORIZED,
        message: 'No token provided'
      });
    }

    const decoded = await request.server.jwt.verify(token) as AuthenticatedUser;
    request.user = decoded;
  } catch (err) {
    return reply.status(HTTP_STATUS.UNAUTHORIZED).send({
      error: MESSAGES.ERROR.INVALID_TOKEN,
      message: 'Invalid or expired token'
    });
  }
};

export const optionalAuth = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const token = request.headers.authorization?.replace('Bearer ', '');
    
    if (token) {
      const decoded = await request.server.jwt.verify(token) as AuthenticatedUser;
      request.user = decoded;
    }
  } catch (err) {
    // Optional auth - continue without user
  }
};