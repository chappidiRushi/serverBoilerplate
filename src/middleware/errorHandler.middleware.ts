import { TResError } from '@utils/zod.util';
import type { FastifyReply, FastifyRequest } from 'fastify';
import { ZodError } from 'zod';
import { config } from '../config/env.config';
import { logger } from '../config/logger.config';
import { HTTP_STATUS } from '../constants/constants';
import { HttpError } from '../utils/errors.util';

// type ErrorResponse = {
//   success: false;
//   message: string;
//   error: {
//     code: string | number;
//     details?: any;
//   };
//   meta: {
//     timestamp: string;
//     requestId: string;
//   };
// };

export const errorHandler = (error: any, request: FastifyRequest, reply: FastifyReply) => {
  const requestId = (request as any).requestId || 'unknown';

  // Default values
  let statusCode: number = HTTP_STATUS.INTERNAL_SERVER_ERROR;
  let errorCode = 'INTERNAL_ERROR';
  let message = 'An unexpected error occurred';
  let details: any = undefined;

  // Map error types to status/code/message
  if (error instanceof HttpError) {
    statusCode = error.status;
    errorCode = errorCode || '';
    details = error.message;
  } else if (error instanceof ZodError) {
    statusCode = HTTP_STATUS.BAD_REQUEST;
    errorCode = 'VALIDATION_ERROR';
    message = 'Validation failed';
    details = error.issues.map((issue: any) => ({
      path: issue.path.join('.'),
      message: issue.message,
      code: issue.code,
    }));
  } else if (error.validation) {
    statusCode = HTTP_STATUS.BAD_REQUEST;
    errorCode = 'VALIDATION_ERROR';
    message = 'Request validation failed';
    details = error.validation;
  } else {
    statusCode = error.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR;
    message = statusCode === HTTP_STATUS.INTERNAL_SERVER_ERROR ? message : error.message;
  }

  // Log error
  logger.error('Request error:', {
    requestId,
    error: error.message,
    code: error.code || statusCode,
    stack: config.NODE_ENV === 'development' ? error.stack : undefined,
    url: request.url,
    method: request.method,
    statusCode,
    params: request.params,
    query: request.query,
    body: request.body,
  });

  // Send response
  const errorResponse: TResError = {
    // success: false,
    status: false,
    message: error.message,
    error: {
      code: errorCode || statusCode,
      details: config.NODE_ENV === 'development' ? details : undefined,
    },
    meta: {
      timestamp: new Date().toISOString(),
      requestId,
    },
  };

  return reply.status(statusCode).send(errorResponse);
};
