import { HTTP_STATUS } from '../config/constants';

class AppError extends Error {
  statusCode: number;
  code: string;
  details?: any;
  isOperational: boolean;
  sourceLocation?: { file: string; line: number; column?: number };

  constructor(
    message: string,
    statusCode: number = HTTP_STATUS.INTERNAL_SERVER_ERROR,
    code: string = 'INTERNAL_ERROR',
    details?: any,
    isOperational: boolean = true
  ) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    this.isOperational = isOperational;

    Error.captureStackTrace?.(this, this.constructor);
    this.sourceLocation = this.getSourceLocation();
  }

  private getSourceLocation() {
    const stack = this.stack?.split('\n').find(
      line =>
        line.includes('at ') &&
        !line.includes('errors.ts') &&
        !line.includes('Error.captureStackTrace')
    );
    if (!stack) return undefined;
    const match = stack.match(/at (?:.*\()?(.+):(\d+):(\d+)\)?/);
    if (!match) return undefined;
    const [, filePath, line, column] = match;
    return {
      file: filePath?.split('/').pop() ?? filePath ?? '',
      line: Number(line),
      column: Number(column)
    };
  }
}

class ValidationError extends AppError {
  constructor(message = 'Validation failed', details?: any) {
    super(message, HTTP_STATUS.BAD_REQUEST, 'VALIDATION_ERROR', details);
  }
}
class AuthenticationError extends AppError {
  constructor(message = 'Authentication required') {
    super(message, HTTP_STATUS.UNAUTHORIZED, 'AUTHENTICATION_ERROR');
  }
}
class AuthorizationError extends AppError {
  constructor(message = 'Access forbidden') {
    super(message, HTTP_STATUS.FORBIDDEN, 'AUTHORIZATION_ERROR');
  }
}
class NotFoundError extends AppError {
  constructor(message = 'Resource not found') {
    super(message, HTTP_STATUS.NOT_FOUND, 'NOT_FOUND_ERROR');
  }
}
class ConflictError extends AppError {
  constructor(message = 'Resource already exists') {
    super(message, HTTP_STATUS.CONFLICT, 'CONFLICT_ERROR');
  }
}
class RateLimitError extends AppError {
  constructor(message = 'Too many requests') {
    super(message, HTTP_STATUS.TOO_MANY_REQUESTS, 'RATE_LIMIT_ERROR');
  }
}

export const Errors = {
  AppError,
  ValidationError,
  AuthenticationError,
  AuthorizationError,
  NotFoundError,
  ConflictError,
  RateLimitError,
};
