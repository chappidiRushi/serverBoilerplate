import { HTTP_STATUS } from '../config/constants';

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code: string;
  public readonly details?: any;
  public readonly isOperational: boolean;
  public readonly sourceLocation?: {
    file: string;
    line: number;
    column?: number;
  };

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

    Error.captureStackTrace(this, this.constructor);
    this.sourceLocation = this.parseStackTrace();
  }

  private parseStackTrace(): { file: string; line: number; column?: number } | undefined {
    try {
      if (!this.stack) return undefined;

      const stackLines = this.stack.split('\n');
      // Find the first line that's not from this error class file
      for (const line of stackLines) {
        if (line.includes('at ') && !line.includes('errors.ts') && !line.includes('Error.captureStackTrace')) {
          // Parse stack trace line format: "at functionName (file:line:column)"
          const match = line.match(/at .* \((.+):(\d+):(\d+)\)|at (.+):(\d+):(\d+)/);
          if (match) {
            const filePath = match[1] || match[4];
            const lineNumber = parseInt(match[2] || match[5]);
            const columnNumber = parseInt(match[3] || match[6]);
            
            if (filePath && lineNumber) {
              // Extract just the filename from the full path
              const fileName = filePath.split('/').pop() || filePath;
              return {
                file: fileName,
                line: lineNumber,
                column: columnNumber
              };
            }
          }
        }
      }
    } catch (error) {
      // If parsing fails, return undefined
      return undefined;
    }
    
    return undefined;
  }
}

export class ValidationError extends AppError {
  constructor(message: string = 'Validation failed', details?: any) {
    super(message, HTTP_STATUS.BAD_REQUEST, 'VALIDATION_ERROR', details);
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string = 'Authentication required') {
    super(message, HTTP_STATUS.UNAUTHORIZED, 'AUTHENTICATION_ERROR');
  }
}

export class AuthorizationError extends AppError {
  constructor(message: string = 'Access forbidden') {
    super(message, HTTP_STATUS.FORBIDDEN, 'AUTHORIZATION_ERROR');
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = 'Resource not found') {
    super(message, HTTP_STATUS.NOT_FOUND, 'NOT_FOUND_ERROR');
  }
}

export class ConflictError extends AppError {
  constructor(message: string = 'Resource already exists') {
    super(message, HTTP_STATUS.CONFLICT, 'CONFLICT_ERROR');
  }
}

export class RateLimitError extends AppError {
  constructor(message: string = 'Too many requests') {
    super(message, HTTP_STATUS.TOO_MANY_REQUESTS, 'RATE_LIMIT_ERROR');
  }
}