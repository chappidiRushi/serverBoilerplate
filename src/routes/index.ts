import { type FastifyInstance } from "fastify";
import { colorRoute } from "../components/color/color.routes";
import { userRoutes } from "../components/user/user.routes";
import { config } from "../config/env.config";
import { productRoutes } from "./product.routes";

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
  await fastify.register(productRoutes, { prefix: '/api/product' });
  await fastify.register(userRoutes, { prefix: '/api/user' });
  await fastify.register(colorRoute, { prefix: '/api/color' });
}