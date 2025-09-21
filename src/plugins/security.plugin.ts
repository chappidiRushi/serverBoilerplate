import { cors } from '@elysiajs/cors';
import { jwt } from '@elysiajs/jwt';
import { Elysia } from 'elysia';
import { config } from '../config/env.config';

export function SecurityPlugin(app: Elysia) {
  app.use(
    cors({
      origin: true,
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    })
  );

  app.use(
    jwt({
      name: 'jwt',
      secret: config.JWT_SECRET
    })
  );

  return app;
}