import { FastifyInstance } from "fastify";
import { requestLogger } from "./request.logger.hook";
import { onRequestHook } from "./response.parser.hook";

export function RegisterHooks(fastify: FastifyInstance) {
  fastify.addHook('onRequest', onRequestHook);
  fastify.addHook('onResponse', requestLogger);
}