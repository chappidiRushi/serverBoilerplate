import type { FastifyRequest, FastifyReply, FastifyError } from 'fastify';
import { HTTP_STATUS, MESSAGES } from '../config/constants';
import { logger } from '../utils/logger';
import { ZodError } from 'zod';
import { AppError } from '../types/errors';
import type { ErrorResponse } from '../types/response';
import { config } from '../config/env';

export const errorHandler = (
  error: any,
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const requestId = (request as any).requestId || 'unknown';

  // Log the error with request context
  logger.error('Request error:', {
    requestId,
    error: error.message,
    stack: config.NODE_ENV === 'development' ? error.stack : undefined,
    url: request.url,
    method: request.method,
    statusCode: error.statusCode,
    code: error.code,
    params: request.params,
    query: request.query,
    body: request.body,
  });

  let statusCode: number;
  let errorCode: string;
  let message: string;
  let details: any;

  // Handle custom application errors
  if (error instanceof AppError) {
    statusCode = error.statusCode;
    errorCode = error.code;
    message = error.message;
    details = error.details;
  }
  // Handle Zod validation errors
  else if (error instanceof ZodError) {
    statusCode = HTTP_STATUS.BAD_REQUEST;
    errorCode = 'VALIDATION_ERROR';
    message = 'Validation failed';
    details = error.issues.map((issue: any) => ({
      path: issue.path.join('.'),
      message: issue.message,
      code: issue.code,
    }));
  }
  // Handle Fastify validation errors
  else if (error.validation) {
    statusCode = HTTP_STATUS.BAD_REQUEST;
    errorCode = 'VALIDATION_ERROR';
    message = 'Request validation failed';
    details = error.validation;
  }
  // Handle JWT errors
  else if (error.message.includes('jwt') || error.message.includes('token')) {
    statusCode = HTTP_STATUS.UNAUTHORIZED;
    errorCode = 'AUTHENTICATION_ERROR';
    message = 'Invalid or expired token';
  }
  // Handle rate limit errors
  else if (error.statusCode === HTTP_STATUS.TOO_MANY_REQUESTS) {
    statusCode = HTTP_STATUS.TOO_MANY_REQUESTS;
    errorCode = 'RATE_LIMIT_ERROR';
    message = 'Too many requests';
  }
  // Handle database constraint errors
  else if (error.message.includes('duplicate key') || error.message.includes('unique constraint')) {
    statusCode = HTTP_STATUS.CONFLICT;
    errorCode = 'CONFLICT_ERROR';
    message = 'Resource already exists';
  }
  // Handle database connection errors
  else if (error.message.includes('connect') && error.message.includes('database')) {
    statusCode = HTTP_STATUS.SERVICE_UNAVAILABLE;
    errorCode = 'DATABASE_ERROR';
    message = 'Database connection failed';
  }
  // Default internal server error
  else {
    statusCode = error.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR;
    errorCode = 'INTERNAL_ERROR';
    message = statusCode === HTTP_STATUS.INTERNAL_SERVER_ERROR 
      ? 'An unexpected error occurred' 
      : error.message;
  }

  // Format error response
  const errorResponse: ErrorResponse = {
    success: false,
    message: 'Request failed',
    error: {
      code: errorCode,
      message,
      details: config.NODE_ENV === 'development' ? details : undefined,
    },
    meta: {
      timestamp: new Date().toISOString(),
      requestId,
    },
  };

  return reply.status(statusCode).send(errorResponse);
};