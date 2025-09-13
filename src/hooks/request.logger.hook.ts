import { type FastifyReply, type FastifyRequest } from 'fastify';
import { logger } from '../utils/logger';

export const requestLogger = async (request: FastifyRequest, reply: FastifyReply) => {
  const startTime = process.hrtime();

  reply.hijack();
  await reply.send();

  const [seconds, nanoseconds] = process.hrtime(startTime);
  const duration = seconds * 1000 + nanoseconds / 1e6;

  logger.info(
    `[${request.requestId}: ${request.method}] ${request.url} - ${reply.statusCode} - ${duration.toFixed(2)}ms - UA: ${request.headers['user-agent'] || ''} - IP: ${request.ip}`
  );
};