import { swagger } from '@elysiajs/swagger';
import { Elysia } from 'elysia';
import { config } from '../config/env.config';

export function SwaggerPlugin(app: Elysia) {
  app.use(
    swagger({
      documentation: {
        info: {
          title: 'Backend API Server',
          description: 'Comprehensive backend API with authentication and CRUD operations',
          version: '1.0.0',
        },
        servers: [
          {
            url: `http://${config.HOST}:${config.PORT}`,
          },
        ],
        components: {
          securitySchemes: {
            bearerAuth: {
              type: 'http',
              scheme: 'bearer',
              bearerFormat: 'JWT',
            },
          },
        },
      },
    })
  );

  return app;
}