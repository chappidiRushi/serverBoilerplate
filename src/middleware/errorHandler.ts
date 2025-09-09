import type { FastifyRequest, FastifyReply, FastifyError } from 'fastify';
import { HTTP_STATUS, MESSAGES } from '../config/constants';
import { logger } from '../utils/logger';
import { ZodError } from 'zod';

export const errorHandler = (
  error: FastifyError,
  request: FastifyRequest,
  reply: FastifyReply
) => {
  // Log the error
  logger.error('Request error:', {
    error: error.message,
    stack: error.stack,
    url: request.url,
    method: request.method,
    params: request.params,
    query: request.query,
    body: request.body,
  });

  // Zod validation errors
  if (error instanceof ZodError) {
    return reply.status(HTTP_STATUS.BAD_REQUEST).send({
      error: MESSAGES.ERROR.VALIDATION,
      message: 'Validation failed',
      details: error.errors.map(err => ({
        path: err.path.join('.'),
        message: err.message,
      })),
    });
  }

  // Fastify validation errors
  if (error.validation) {
    return reply.status(HTTP_STATUS.BAD_REQUEST).send({
      error: MESSAGES.ERROR.VALIDATION,
      message: 'Validation failed',
      details: error.validation,
    });
  }

  // JWT errors
  if (error.message.includes('jwt') || error.message.includes('token')) {
    return reply.status(HTTP_STATUS.UNAUTHORIZED).send({
      error: MESSAGES.ERROR.INVALID_TOKEN,
      message: error.message,
    });
  }

  // Rate limit errors
  if (error.statusCode === HTTP_STATUS.TOO_MANY_REQUESTS) {
    return reply.status(HTTP_STATUS.TOO_MANY_REQUESTS).send({
      error: MESSAGES.ERROR.RATE_LIMIT,
      message: 'Too many requests',
    });
  }

  // Database errors
  if (error.message.includes('duplicate key') || error.message.includes('unique constraint')) {
    return reply.status(HTTP_STATUS.CONFLICT).send({
      error: MESSAGES.ERROR.CONFLICT,
      message: 'Resource already exists',
    });
  }

  // Default to internal server error
  const statusCode = error.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR;
  
  return reply.status(statusCode).send({
    error: MESSAGES.ERROR.INTERNAL_SERVER,
    message: statusCode === HTTP_STATUS.INTERNAL_SERVER_ERROR 
      ? 'An unexpected error occurred' 
      : error.message,
  });
};