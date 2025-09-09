import type { FastifyRequest, FastifyReply } from 'fastify';
import { eq, and, desc, count } from 'drizzle-orm';
import { db } from '../db/connection';
import { posts, users } from '../db/schema';
import { HTTP_STATUS, MESSAGES } from '../config/constants';
import type { CreatePostInput, UpdatePostInput, PostParams, PostQuery } from '../schemas/posts';

export const createPost = async (
  request: FastifyRequest<{ Body: CreatePostInput }>,
  reply: FastifyReply
) => {
  const { title, content, isPublished } = request.body;
  const userId = request.user!.id;

  try {
    const [newPost] = await db
      .insert(posts)
      .values({
        title,
        content,
        isPublished,
        userId,
      })
      .returning();

    return reply.status(HTTP_STATUS.CREATED).send({
      message: MESSAGES.SUCCESS.CREATED,
      data: { post: newPost }
    });
  } catch (error) {
    throw error;
  }
};

export const getPosts = async (
  request: FastifyRequest<{ Querystring: PostQuery }>,
  reply: FastifyReply
) => {
  const { page = 1, limit = 10, userId: filterUserId, isPublished } = request.query;
  const offset = (page - 1) * limit;

  try {
    // Build where conditions
    const conditions = [];
    if (filterUserId) conditions.push(eq(posts.userId, filterUserId));
    if (isPublished !== undefined) conditions.push(eq(posts.isPublished, isPublished));

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    // Get posts with user info
    const postsData = await db
      .select({
        id: posts.id,
        title: posts.title,
        content: posts.content,
        isPublished: posts.isPublished,
        createdAt: posts.createdAt,
        updatedAt: posts.updatedAt,
        user: {
          id: users.id,
          email: users.email,
          firstName: users.firstName,
          lastName: users.lastName,
        }
      })
      .from(posts)
      .leftJoin(users, eq(posts.userId, users.id))
      .where(whereClause)
      .orderBy(desc(posts.createdAt))
      .limit(limit)
      .offset(offset);

    // Get total count
    const [{ total }] = await db
      .select({ total: count() })
      .from(posts)
      .where(whereClause);

    return reply.status(HTTP_STATUS.OK).send({
      message: MESSAGES.SUCCESS.FETCHED,
      data: {
        posts: postsData,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        }
      }
    });
  } catch (error) {
    throw error;
  }
};

export const getPost = async (
  request: FastifyRequest<{ Params: PostParams }>,
  reply: FastifyReply
) => {
  const { id } = request.params;

  try {
    const [post] = await db
      .select({
        id: posts.id,
        title: posts.title,
        content: posts.content,
        isPublished: posts.isPublished,
        createdAt: posts.createdAt,
        updatedAt: posts.updatedAt,
        user: {
          id: users.id,
          email: users.email,
          firstName: users.firstName,
          lastName: users.lastName,
        }
      })
      .from(posts)
      .leftJoin(users, eq(posts.userId, users.id))
      .where(eq(posts.id, id))
      .limit(1);

    if (!post) {
      return reply.status(HTTP_STATUS.NOT_FOUND).send({
        error: MESSAGES.ERROR.NOT_FOUND,
        message: 'Post not found'
      });
    }

    return reply.status(HTTP_STATUS.OK).send({
      message: MESSAGES.SUCCESS.FETCHED,
      data: { post }
    });
  } catch (error) {
    throw error;
  }
};

export const updatePost = async (
  request: FastifyRequest<{ Params: PostParams; Body: UpdatePostInput }>,
  reply: FastifyReply
) => {
  const { id } = request.params;
  const updates = request.body;
  const userId = request.user!.id;

  try {
    // Check if post exists and belongs to user
    const [existingPost] = await db
      .select()
      .from(posts)
      .where(and(eq(posts.id, id), eq(posts.userId, userId)))
      .limit(1);

    if (!existingPost) {
      return reply.status(HTTP_STATUS.NOT_FOUND).send({
        error: MESSAGES.ERROR.NOT_FOUND,
        message: 'Post not found or you do not have permission to update it'
      });
    }

    // Update post
    const [updatedPost] = await db
      .update(posts)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(posts.id, id))
      .returning();

    return reply.status(HTTP_STATUS.OK).send({
      message: MESSAGES.SUCCESS.UPDATED,
      data: { post: updatedPost }
    });
  } catch (error) {
    throw error;
  }
};

export const deletePost = async (
  request: FastifyRequest<{ Params: PostParams }>,
  reply: FastifyReply
) => {
  const { id } = request.params;
  const userId = request.user!.id;

  try {
    // Check if post exists and belongs to user
    const [existingPost] = await db
      .select()
      .from(posts)
      .where(and(eq(posts.id, id), eq(posts.userId, userId)))
      .limit(1);

    if (!existingPost) {
      return reply.status(HTTP_STATUS.NOT_FOUND).send({
        error: MESSAGES.ERROR.NOT_FOUND,
        message: 'Post not found or you do not have permission to delete it'
      });
    }

    // Delete post
    await db.delete(posts).where(eq(posts.id, id));

    return reply.status(HTTP_STATUS.NO_CONTENT).send();
  } catch (error) {
    throw error;
  }
};