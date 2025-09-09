export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  meta?: {
    timestamp: string;
    requestId?: string;
    pagination?: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}

export interface SuccessResponse<T = any> extends ApiResponse<T> {
  success: true;
  data: T;
}

export interface ErrorResponse extends ApiResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: any;
  };
}