import type { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { generateRequestId } from '../utils/helpers.util';
import { ZResOK } from '../utils/zod.util';

declare module 'fastify' {
  interface FastifyReply {
    success<T>(data: T, statusCode: number, message?: string): FastifyReply;
  }
}

declare module "fastify" {
  interface FastifyRequest {
    requestId: string; // now required
  }
}

export const onRequestHook = async (request: FastifyRequest, reply: FastifyReply) => {
  request.requestId = generateRequestId();
  reply.success = function <T>(data: T, statusCode: number, message = 'Success'): FastifyReply {
    const response = {
      status: true,
      message,
      data,
      meta: {
        timestamp: new Date().toISOString(),
        requestId: (request as any).requestId,
      },
    };

    try {
      const zodSchema = (request as any)?.routeOptions?.schema?.response?.[statusCode]
      if (zodSchema) {
        const parsedResponse = zodSchema.parse(response);
        return this.status(statusCode).send(parsedResponse);
      }
    } catch (e) {
      if (e instanceof z.ZodError) {
        return this.status(400).send({
          success: false,
          message: 'Response Validation Failed',
          error: {
            code: 400,
            message: e.message,
            details: e.issues
          },
          meta: {
            timestamp: new Date().toISOString(),
            requestId: (request as any).requestId,
          },
        });
      }
    }

    const parsedResponse = ZResOK(z.any()).parse(response);
    return this.status(statusCode).send(parsedResponse);
  };
};
