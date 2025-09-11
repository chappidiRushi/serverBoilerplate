import { FastifyInstance } from "fastify";
import { config } from "../config/env";
import { productRoutes } from "./product.routes";

export async function RegisterRoutes(fastify: FastifyInstance) {
  fastify.get('/health', async (request, reply) => {
    return reply.success(
      {
        status: 'OK',
        environment: config.NODE_ENV,
        uptime: process.uptime(),
      },
      'Server is running'
    );
  });

  // API routes
  // await fastify.register(authRoutes, { prefix: '/api/auth' });
  await fastify.register(productRoutes, { prefix: '/api/product' });
}