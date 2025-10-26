import compress from '@fastify/compress';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import jwt from '@fastify/jwt';
import rateLimit from '@fastify/rate-limit';
import { type FastifyInstance } from 'fastify';
import { config } from '../config/env.config';


export async function SecurityPlugin(fastify: FastifyInstance) {
  await fastify.register(cors, {
    origin:"*",
    // origin: (origin, cb) => cb(null, true),
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  });

  await fastify.register(helmet, { contentSecurityPolicy: false });
  await fastify.register(compress);
  await fastify.register(rateLimit, { max: 10000, timeWindow: '5 minutes' });
  await fastify.register(jwt, { secret: config.JWT_SECRET });
}