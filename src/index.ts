import Fastify from 'fastify';
import { config } from './config/env';
import { logger } from './utils/logger';
import { HTTP_STATUS, MESSAGES } from './config/constants';

// Initialize Fastify instance
const fastify = Fastify({
  logger: false, // Using Winston instead
});

// Health check route
fastify.get('/health', async (request, reply) => {
  return reply.status(HTTP_STATUS.OK).send({
    status: 'OK',
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// Start server
const start = async () => {
  try {
    const port = config.PORT;
    const host = config.HOST;
    
    await fastify.listen({ 
      port, 
      host,
      listenTextResolver: (address) => {
        logger.info(`Server listening on ${address}`);
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