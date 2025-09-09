export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503
} as const;

export const MESSAGES = {
  SUCCESS: {
    CREATED: 'Resource created successfully',
    UPDATED: 'Resource updated successfully',
    DELETED: 'Resource deleted successfully',
    FETCHED: 'Resource fetched successfully'
  },
  ERROR: {
    VALIDATION: 'Validation failed',
    UNAUTHORIZED: 'Unauthorized access',
    FORBIDDEN: 'Access forbidden',
    NOT_FOUND: 'Resource not found',
    CONFLICT: 'Resource already exists',
    INTERNAL_SERVER: 'Internal server error',
    RATE_LIMIT: 'Too many requests',
    INVALID_TOKEN: 'Invalid or expired token'
  }
} as const;

export const RATE_LIMIT = {
  MAX: 100,
  WINDOW: '15 minutes'
} as const;

export const JWT = {
  EXPIRES_IN: '1d',
  REFRESH_EXPIRES_IN: '7d'
} as const;