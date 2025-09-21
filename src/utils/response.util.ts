import { generateRequestId } from './helpers.util';

export function successResponse<T>(data: T, statusCode: number = 200, message: string = 'Success') {
  return {
    status: true,
    message,
    data,
    meta: {
      timestamp: new Date().toISOString(),
      requestId: generateRequestId(),
    },
  };
}

export function formatResponse<T>(data: T, message: string = 'Success') {
  return successResponse(data, 200, message);
}