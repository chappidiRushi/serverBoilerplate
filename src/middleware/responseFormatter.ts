import type { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { generateRequestId } from '../utils/helpers';
import { PaginatedResponseSchema, SuccessResponseSchema } from '../utils/response';

declare module 'fastify' {
  interface FastifyReply {
    success<T>(data: T, message?: string, statusCode?: number): FastifyReply;
    paginated<T>(
      data: T[],
      pagination: { page: number; limit: number; total: number; totalPages: number },
      message?: string
    ): FastifyReply;
  }
}

export const responseFormatter = async (request: FastifyRequest, reply: FastifyReply) => {
  (request as any).requestId = generateRequestId();
  reply.success = function <T>(data: T, message = 'Success', statusCode = 200): FastifyReply {
    const response = {
      status: 'success' as const,
      message,
      data,
      meta: {
        timestamp: new Date().toISOString(),
        requestId: (request as any).requestId,
      },
    };

    // Validate/parse using Zod
    const parsedResponse = SuccessResponseSchema(z.any()).parse(response);
    return this.status(statusCode).send(parsedResponse);
  };

  reply.paginated = function <T>(
    data: T[],
    pagination: { page: number; limit: number; total: number; totalPages: number },
    message = 'Data retrieved successfully'
  ): FastifyReply {
    const response = {
      status: 'success' as const,
      message,
      data,
      meta: {
        timestamp: new Date().toISOString(),
        requestId: (request as any).requestId,
        pagination,
      },
    };

    // Validate/parse using Zod
    const parsedResponse = PaginatedResponseSchema(z.any()).parse(response);

    return this.status(200).send(parsedResponse);
  };
};
