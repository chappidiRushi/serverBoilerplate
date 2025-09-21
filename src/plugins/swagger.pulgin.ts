import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import { type FastifyInstance } from 'fastify';
import { jsonSchemaTransform, serializerCompiler, validatorCompiler } from 'fastify-type-provider-zod';
import { config } from '../config/env.config';

export async function SwaggerPlugin(fastify: FastifyInstance) {
  await fastify.register(swagger, {
    openapi: {
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
    transform: jsonSchemaTransform,
  });

  await fastify.register(swaggerUi, {
    routePrefix: '/docs',
    uiConfig: {
      docExpansion: 'list',
      deepLinking: false,
    },
  });

  
  // Set Zod compilers
  fastify.setValidatorCompiler(validatorCompiler);
  fastify.setSerializerCompiler(serializerCompiler);

  // API Reference
  fastify.register(import('@scalar/fastify-api-reference'), {
    routePrefix: '/reference',
    configuration: {
      title: 'Our API Reference',
      url: '/docs/json',
    },
  });
}