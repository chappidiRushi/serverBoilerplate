import { FastifyInstance } from "fastify";
import { requestLogger } from "../middleware/requestLogger";
import { responseFormatter } from "../middleware/responseFormatter";

export function RegisterHooks(fastify: FastifyInstance) {
  fastify.addHook('onRequest', responseFormatter);
  fastify.addHook('onResponse', requestLogger);
  // fastify.addHook('onSend', OnSendHook);
}