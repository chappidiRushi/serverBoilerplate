import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import Fastify from 'fastify';
import { config } from './config/env';
import { errorHandler } from './middleware/errorHandler';
import { requestLogger } from './middleware/requestLogger';
import { responseFormatter } from './middleware/responseFormatter';
import { logger } from './utils/logger';

import { jsonSchemaTransform, serializerCompiler, validatorCompiler, ZodTypeProvider } from 'fastify-type-provider-zod';
import { RegisterPlugins } from './plugins';
import { productRoutes } from './routes/product.routes';

// Initialize Fastify instance with Zod type provider
const fastify = Fastify({
  logger: false,
}).withTypeProvider<ZodTypeProvider>();

// Register plugins
const registerPlugins = async () => {

  // Swagger with Zod transform

};

const registerRoutes = async () => {
  fastify.get('/health', async (request, reply) => {
    return reply.success(
      {
        status: 'OK',
        environment: config.NODE_ENV,
        uptime: process.uptime(),
      },
      'Server is running'
    );
  });

  // API routes
  // await fastify.register(authRoutes, { prefix: '/api/auth' });
  await fastify.register(productRoutes, { prefix: '/api/product' });
};

// Set global error handler
fastify.setErrorHandler(errorHandler);

const start = async () => {
  try {
    fastify.addHook('onRequest', responseFormatter);
    fastify.addHook('onResponse', requestLogger);
    await RegisterPlugins(fastify);
    await registerPlugins();
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
      },
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
