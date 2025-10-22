import { FertilizerRoute } from "@components/fertilizers/fertilizer.routes";
import { plantRoute } from "@components/plant/plant.routes";
import { type FastifyInstance } from "fastify";
import { colorRoute } from "../components/color/color.routes";
import { plantCategoryRoute } from "../components/plant-category/plant-category.routes";
import { userRoutes } from "../components/user/user.routes";
import { config } from "../config/env.config";
import { jwtAuthHook } from "../hooks/jwt-auth.hook"; // import the hook

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
  await fastify.register(async (instance) => { instance.addHook('preHandler', jwtAuthHook); await instance.register(colorRoute); }, { prefix: '/api/color', });
  await fastify.register(async (instance) => { await instance.register(plantCategoryRoute); }, { prefix: '/api/plant-category', });
  await fastify.register(async (instance) => { await instance.register(FertilizerRoute); }, { prefix: '/api/fertilizer', });
  await fastify.register(async (instance) => { await instance.register(plantRoute); }, { prefix: '/api/plant', });
}