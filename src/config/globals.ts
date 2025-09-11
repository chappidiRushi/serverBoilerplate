import { config } from './env';

declare global {
  // Add all your globals here
  var APP_CONFIG: typeof config;
}

global.APP_CONFIG = config;



declare module 'fastify' {
  interface FastifyReply {
    success<T>(data: T, message?: string, statusCode?: number): FastifyReply;
    paginated<T>(
      data: T[],
      pagination: { page: number; limit: number; total: number; totalPages: number },
      message?: string
    ): FastifyReply;
  }
  interface FastifyRequest {
    requestId: string;
  }
}
