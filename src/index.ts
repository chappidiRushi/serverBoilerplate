import './config/globals.config';

import { Elysia } from 'elysia';
import { cors } from '@elysiajs/cors';
import { jwt } from '@elysiajs/jwt';
import { swagger } from '@elysiajs/swagger';
import { config } from './config/env.config';
import { logger } from './config/logger.config';
import { errorHandler } from './middleware/errorHandler.middleware';
import { successResponse } from './utils/response.util';
import { UserRouteCreateSchema, UserRouteLoginReq } from './components/user/user.validator';
import { UserCreate, UserLogin } from './components/user/user.controller';

const app = new Elysia()
  .onError(({ error, set }) => {
    const response = errorHandler(error);
    set.status = response.error.code as number || 500;
    return response;
  })
  .use(
    cors({
      origin: true,
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    })
  )
  .use(
    jwt({
      name: 'jwt',
      secret: config.JWT_SECRET
    })
  )
  .use(
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
  )
  .get('/health', async () => {
    return successResponse({
      status: 'OK',
      environment: config.NODE_ENV,
      uptime: process.uptime(),
    }, 200, 'Server is running');
  })
  .group('/api/user', (app) => 
    app
      .post(
        "/register",
        async ({ body }) => {
          const newUser = await UserCreate(body);
          logger.info("user created", newUser);
          return successResponse(newUser, 201, "User Registration Completed Successfully");
        },
        {
          body: UserRouteCreateSchema,
          detail: {
            summary: "User Registration",
            description: "Register a new user with email, password, and other details.",
            tags: ["User", "Auth"]
          }
        }
      )
      .post(
        "/login",
        async ({ body, jwt }) => {
          const replyData = await UserLogin(body, jwt);
          return successResponse(replyData, 200, "Login Successfully");
        },
        {
          body: UserRouteLoginReq,
          detail: {
            summary: "User Login",
            description: "Authenticate a user and return a JWT token on success.",
            tags: ["User", "Auth"]
          }
        }
      )
  );

const start = async () => {
  try {
    const port = config.PORT;
    const host = config.HOST;
    
    app.listen(port);
    
    logger.info(`Server listening on ${host}:${port}`);
    logger.info(`📚 API Documentation available at: http://${host}:${port}/swagger`);
    logger.info(`🚀 Server started successfully on ${host}:${port}`);
  } catch (err) {
    logger.error('Failed to start server:', err);
    process.exit(1);
  }
};

// Graceful shutdown
const gracefulShutdown = async (signal: string) => {
  logger.info(`Received ${signal}, shutting down gracefully...`);
  try {
    await app.stop();
    logger.info('Server closed successfully');
    process.exit(0);
  } catch (err) {
    logger.error('Error during shutdown:', err);
    process.exit(1);
  }
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

start();
