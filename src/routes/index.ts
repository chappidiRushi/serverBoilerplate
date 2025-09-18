import { type FastifyInstance } from "fastify";
import { userRoutes } from "../components/user/user.routes";
import { config } from "../config/env.config";
import { jwtAuthHook } from "../hooks/jwt-auth.hook"; // import the hook
import { productRoutes } from "./product.routes";
import { colorRoute } from "../components/color/color.routes";

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
  // await fastify.register({ prefix: '/api/product' });
  await fastify.register(userRoutes, { prefix: '/api/user' });
  await fastify.register(async (instance) => {
    instance.addHook('preHandler', jwtAuthHook);
    await instance.register(colorRoute);
  }, { prefix: '/api/color', });
}