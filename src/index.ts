import './config/globals';

import Fastify from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { config } from './config/env';
import { RegisterHooks } from './hooks';
import { errorHandler } from './middleware/errorHandler';
import { RegisterPlugins } from './plugins';
import { RegisterRoutes } from './routes';
import { logger } from './utils/logger';
import { setupShutdown } from './utils/shutdown';


const fastify = Fastify({ logger: false, }).withTypeProvider<ZodTypeProvider>();
fastify.setErrorHandler(errorHandler);

const start = async () => {
  try {
    await RegisterHooks(fastify);
    await RegisterPlugins(fastify);
    await RegisterRoutes(fastify);
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
setupShutdown(fastify);
start();
