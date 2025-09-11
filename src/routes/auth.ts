import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { getProfile, login, register } from '../controllers/authController';
import { authenticate } from '../middleware/auth';
import { LoginSchema, RegisterSchema } from '../schemas/auth';

export async function authRoutes(fastify: FastifyInstance) {
  // Validation middleware
  const validateRegister = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      request.body = RegisterSchema.parse(request.body);
    } catch (error) {
      reply.status(400).send({ error: 'Validation failed', details: error });
    }
  };

  const validateLogin = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      request.body = LoginSchema.parse(request.body);
    } catch (error) {
      reply.status(400).send({ error: 'Validation failed', details: error });
    }
  };

  // Auth routes
  fastify.post('/register', {
    preHandler: [validateRegister],
    schema: {
      tags: ['Authentication'],
      summary: 'Register a new user',
      body: {
        type: 'object',
        required: ['email', 'password', 'firstName', 'lastName'],
        properties: {
          email: { type: 'string', format: 'email' },
          password: { type: 'string', minLength: 8 },
          firstName: { type: 'string', minLength: 1, maxLength: 100 },
          lastName: { type: 'string', minLength: 1, maxLength: 100 }
        }
      }
    },
  }, register);

  fastify.post('/login', {
    preHandler: [validateLogin],
    schema: {
      tags: ['Authentication'],
      summary: 'Login user',
      body: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: { type: 'string', format: 'email' },
          password: { type: 'string', minLength: 1 }
        }
      }
    },
  }, login);

  fastify.get('/profile', {
    preHandler: [authenticate],
    schema: {
      tags: ['Authentication'],
      summary: 'Get user profile',
      security: [{ bearerAuth: [] }],
    },
  }, getProfile);
}