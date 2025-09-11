import compress from '@fastify/compress';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import jwt from '@fastify/jwt';
import rateLimit from '@fastify/rate-limit';
import { FastifyInstance } from 'fastify';
import { config } from '../config/env';


export async function SecurityPlugin(fastify: FastifyInstance) {
  await fastify.register(cors, {
    origin: (origin, cb) => cb(null, true),
    credentials: true,
  });

  await fastify.register(helmet, { contentSecurityPolicy: false });
  await fastify.register(compress);
  await fastify.register(rateLimit, { max: 1000, timeWindow: '5 minutes' });
  await fastify.register(jwt, { secret: config.JWT_SECRET });
}