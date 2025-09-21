import { Elysia } from 'elysia';
import { jwt } from '@elysiajs/jwt';
import { config } from '../config/env.config';

export interface AuthenticatedUser {
  id: number;
  email: string;
  firstName?: string;
  lastName?: string;
}

const publicRoutePatterns = [/^\/login$/, /^\/register$/, /^\/swagger(\/.*)?$/, /^\/health$/];

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
    
    if (publicRoutePatterns.some((pattern) => pattern.test(pathname))) {
      return {};
    }

    const authorization = headers['authorization'];
    if (!authorization || !authorization.startsWith('Bearer ')) {
      throw new Error('Unauthorized');
    }

    const token = authorization.substring(7);
    try {
      const user = await jwt.verify(token) as AuthenticatedUser;
      return { user };
    } catch (err) {
      throw new Error('Unauthorized');
    }
  });