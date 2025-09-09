import type { FastifyInstance } from 'fastify';
import { createPost, getPosts, getPost, updatePost, deletePost } from '../controllers/postsController';
import { authenticate, optionalAuth } from '../middleware/auth';
import { CreatePostSchema, UpdatePostSchema, PostParamsSchema, PostQuerySchema } from '../schemas/posts';

export async function postsRoutes(fastify: FastifyInstance) {
  // Validation middleware
  const validateCreatePost = async (request: any, reply: any) => {
    try {
      request.body = CreatePostSchema.parse(request.body);
    } catch (error) {
      reply.status(400).send({ error: 'Validation failed', details: error });
    }
  };

  const validateUpdatePost = async (request: any, reply: any) => {
    try {
      request.body = UpdatePostSchema.parse(request.body);
    } catch (error) {
      reply.status(400).send({ error: 'Validation failed', details: error });
    }
  };

  const validatePostParams = async (request: any, reply: any) => {
    try {
      request.params = PostParamsSchema.parse(request.params);
    } catch (error) {
      reply.status(400).send({ error: 'Invalid post ID', details: error });
    }
  };

  const validatePostQuery = async (request: any, reply: any) => {
    try {
      request.query = PostQuerySchema.parse(request.query);
    } catch (error) {
      reply.status(400).send({ error: 'Invalid query parameters', details: error });
    }
  };

  // Get all posts (public with optional auth)
  fastify.get('/', {
    preHandler: [optionalAuth, validatePostQuery],
    schema: {
      tags: ['Posts'],
      summary: 'Get all posts',
      querystring: {
        type: 'object',
        properties: {
          page: { type: 'number', minimum: 1, default: 1 },
          limit: { type: 'number', minimum: 1, maximum: 100, default: 10 },
          userId: { type: 'number', minimum: 1 },
          isPublished: { type: 'boolean' }
        }
      }
    },
  }, getPosts);

  // Get single post (public with optional auth)
  fastify.get('/:id', {
    preHandler: [optionalAuth, validatePostParams],
    schema: {
      tags: ['Posts'],
      summary: 'Get a single post',
      params: {
        type: 'object',
        required: ['id'],
        properties: {
          id: { type: 'number', minimum: 1 }
        }
      }
    },
  }, getPost);

  // Create post (requires auth)
  fastify.post('/', {
    preHandler: [authenticate, validateCreatePost],
    schema: {
      tags: ['Posts'],
      summary: 'Create a new post',
      security: [{ bearerAuth: [] }],
      body: {
        type: 'object',
        required: ['title'],
        properties: {
          title: { type: 'string', minLength: 1, maxLength: 255 },
          content: { type: 'string' },
          isPublished: { type: 'boolean', default: false }
        }
      }
    },
  }, createPost);

  // Update post (requires auth)
  fastify.put('/:id', {
    preHandler: [authenticate, validatePostParams, validateUpdatePost],
    schema: {
      tags: ['Posts'],
      summary: 'Update a post',
      security: [{ bearerAuth: [] }],
      params: {
        type: 'object',
        required: ['id'],
        properties: {
          id: { type: 'number', minimum: 1 }
        }
      },
      body: {
        type: 'object',
        properties: {
          title: { type: 'string', minLength: 1, maxLength: 255 },
          content: { type: 'string' },
          isPublished: { type: 'boolean' }
        }
      }
    },
  }, updatePost);

  // Delete post (requires auth)
  fastify.delete('/:id', {
    preHandler: [authenticate, validatePostParams],
    schema: {
      tags: ['Posts'],
      summary: 'Delete a post',
      security: [{ bearerAuth: [] }],
      params: {
        type: 'object',
        required: ['id'],
        properties: {
          id: { type: 'number', minimum: 1 }
        }
      }
    },
  }, deletePost);
}