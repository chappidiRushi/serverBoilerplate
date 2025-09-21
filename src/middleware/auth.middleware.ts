import { Elysia } from 'elysia';
import { jwt } from '@elysiajs/jwt';
import { config } from '../config/env.config';

export interface AuthenticatedUser {
  id: number;
  email: string;
  firstName?: string;
  lastName?: string;
}

const publicRoutePatterns = [/^\/login$/, /^\/register$/, /^\/swagger(\/.*)?$/, /^\/health$/, /^\/$/];

export const jwtAuthMiddleware = new Elysia()
  .use(
    jwt({
      name: 'jwt',
      secret: config.JWT_SECRET
    })
  )
  .derive(async ({ jwt, request, headers }) => {
    const url = request.url;
    const pathname = new URL(url).pathname;
    
    // Remove API prefix for pattern matching
    const routePath = pathname.replace(/^\/api\/[^\/]+/, '');
    
    if (publicRoutePatterns.some((pattern) => pattern.test(routePath))) {
      return {};
    }

    const authorization = headers['authorization'];
    if (!authorization || !authorization.startsWith('Bearer ')) {
      throw new Error('Unauthorized: No valid token provided');
    }

    const token = authorization.substring(7);
    try {
      const payload = await jwt.verify(token);
      if (!payload || typeof payload !== 'object') {
        throw new Error('Invalid token payload');
      }
      
      const user: AuthenticatedUser = {
        id: payload.userId || payload.id,
        email: payload.email,
        firstName: payload.firstName,
        lastName: payload.lastName,
      };
      
      return { user };
    } catch (err) {
      throw new Error('Unauthorized: Invalid or expired token');
    }
  });