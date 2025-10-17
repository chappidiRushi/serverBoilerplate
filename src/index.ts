import './config/globals.config';

import Fastify from 'fastify';
import { type ZodTypeProvider } from 'fastify-type-provider-zod';
import { config } from './config/env.config';
import { logger } from './config/logger.config';
import { RegisterHooks } from './hooks';
import { errorHandler } from './middleware/errorHandler.middleware';
import { RegisterPlugins } from './plugins';
import { RegisterRoutes } from './routes';

function genReqId(){
  return `req-${Date.now()}-${Math.floor(Math.random() * 100000)}`;
}


const fastify = Fastify({ logger: false, genReqId }).withTypeProvider<ZodTypeProvider>();
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
start();
