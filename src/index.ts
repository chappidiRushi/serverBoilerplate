import Fastify, { fastify } from 'fastify';
import { config } from './config/env';
import { errorHandler } from './middleware/errorHandler';
import { responseFormatter } from './middleware/responseFormatter';
import { authRoutes } from './routes/auth';
import { logger } from './utils/logger';

// Initialize Fastify instance
const fastify = Fastify({
  logger: false, // Using Winston instead
});

// Register plugins
const registerPlugins = async () => {
  // CORS
  await fastify.register(import('@fastify/cors'), {
    origin: true,
    credentials: true,
  });

  // Helmet for security
  await fastify.register(import('@fastify/helmet'), {
    contentSecurityPolicy: false,
  });

  // Compression
  await fastify.register(import('@fastify/compress'));

  // Rate limiting
  await fastify.register(import('@fastify/rate-limit'), {
    max: 100,
    timeWindow: '15 minutes',
  });

  // JWT
  await fastify.register(import('@fastify/jwt'), {
    secret: config.JWT_SECRET,
  });

  // Swagger
  await fastify.register(import('@fastify/swagger'), {
    swagger: {
      info: {
        title: 'Backend API Server',
        description: 'Comprehensive backend API with authentication and CRUD operations',
        version: '1.0.0',
      },
      host: `${config.HOST}:${config.PORT}`,
      schemes: ['http', 'https'],
      consumes: ['application/json'],
      produces: ['application/json'],
      securityDefinitions: {
        bearerAuth: {
          type: 'apiKey',
          name: 'Authorization',
          in: 'header',
          description: 'Enter: Bearer <token>',
        },
      },
    },
  });

  await fastify.register(import('@fastify/swagger-ui'), {
    routePrefix: '/docs',
    uiConfig: {
      docExpansion: 'list',
      deepLinking: false,
    },
  });
};

// Register routes
const registerRoutes = async () => {
  // Health check route
  fastify.get('/health', async (request, reply) => {
    return reply.success({
      status: 'OK',
      environment: config.NODE_ENV,
      uptime: process.uptime(),
    }, 'Server is running');
  });

  // API routes
  await fastify.register(authRoutes, { prefix: '/api/auth' });
};

// Error handler
fastify.setErrorHandler(errorHandler);

// Start server
const start = async () => {
  try {
    // Register response formatter middleware first
    fastify.addHook('onRequest', responseFormatter);

    // Register plugins
    await registerPlugins();

    // Register routes
    await registerRoutes();

    const port = config.PORT;
    const host = config.HOST;

    await fastify.listen({
      port,
      host,
      listenTextResolver: (address) => {
        logger.info(`Server listening on ${address}`);
        logger.info(`📚 API Documentation available at: ${address}/docs`);
        return `Server ready on ${address}`;
      }
    });

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
    await fastify.close();
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