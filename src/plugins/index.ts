import { type FastifyInstance } from "fastify";
import { SecurityPlugin } from "./security.plugin";
import { SwaggerPlugin } from './swagger.pulgin';


export async function RegisterPlugins(fastify: FastifyInstance) {
  await SecurityPlugin(fastify);
  await SwaggerPlugin(fastify)
}