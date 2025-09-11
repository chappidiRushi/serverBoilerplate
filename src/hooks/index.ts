import { FastifyInstance } from "fastify";
import { requestLogger } from "../middleware/requestLogger";
import { onRequestHook } from "../middleware/responseFormatter";

export function RegisterHooks(fastify: FastifyInstance) {
  fastify.addHook('onRequest', onRequestHook);
  fastify.addHook('onResponse', requestLogger);
  // fastify.addHook('onSend', OnSendHook);
}