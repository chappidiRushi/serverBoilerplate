import type { FastifyRequest, FastifyReply } from 'fastify';
import type { ApiResponse, SuccessResponse } from '../types/response';
import { generateRequestId } from '../utils/helpers';

declare module 'fastify' {
  interface FastifyReply {
    success<T>(data: T, message?: string, statusCode?: number): FastifyReply;
    paginated<T>(
      data: T[],
      pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
      },
      message?: string
    ): FastifyReply;
  }
  
  interface FastifyRequest {
    requestId: string;
  }
}

export const responseFormatter = async (request: FastifyRequest, reply: FastifyReply) => {
  // Generate unique request ID
  request.requestId = generateRequestId();

  // Add success response method
  reply.success = function<T>(data: T, message: string = 'Success', statusCode: number = 200) {
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

  // Add paginated response method
  reply.paginated = function<T>(
    data: T[],
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    },
    message: string = 'Data retrieved successfully'
  ) {
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