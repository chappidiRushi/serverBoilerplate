import type { FastifyReply, FastifyRequest } from 'fastify';
import type { SuccessResponse } from '../types/response';
import { generateRequestId } from '../utils/helpers';

export const responseFormatter = async (request: FastifyRequest, reply: FastifyReply) => {
  // Generate unique request ID for tracing
  request.requestId = generateRequestId();
  // will format reply.success(data, message, statusCode)
  reply.success = function <T>(data: T, message = 'Success', statusCode = 200): FastifyReply {
    const response: SuccessResponse<T> = {
      success: true,
      message,
      data,
      meta: {
        timestamp: new Date().toISOString(),
        requestId: request.requestId,
      },
    };
    return this.status(statusCode).send(response);
  };
  // will format reply.paginated(data, pagination, message)
  reply.paginated = function <T>(
    data: T[],
    pagination: { page: number; limit: number; total: number; totalPages: number },
    message = 'Data retrieved successfully'
  ): FastifyReply {
    const response: SuccessResponse<T[]> = {
      success: true,
      message,
      data,
      meta: {
        timestamp: new Date().toISOString(),
        requestId: request.requestId,
        pagination,
      },
    };
    return this.status(200).send(response);
  };
};