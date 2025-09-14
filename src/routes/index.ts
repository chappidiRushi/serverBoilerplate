import { type FastifyInstance } from "fastify";
import { config } from "../config/env";
import { colorRoute } from "./color.routes";
import { productRoutes } from "./product.routes";
import { userRoutes } from "./user.routes";

export async function RegisterRoutes(fastify: FastifyInstance) {
  fastify.get('/health', async (request, reply) => {
    return reply.success(
      {
        status: 'OK',
        environment: config.NODE_ENV,
        uptime: process.uptime(),
      },
      200,
      'Server is running'
    );
  });

  // API routes
  // await fastify.register(authRoutes, { prefix: '/api/auth' });
  await fastify.register(productRoutes, { prefix: '/api/product' });
  await fastify.register(userRoutes, { prefix: '/api/user' });
  await fastify.register(colorRoute, { prefix: '/api/user' });
}