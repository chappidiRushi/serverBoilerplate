import type { FastifyRequest, FastifyReply } from 'fastify';
import { eq, and, desc, count } from 'drizzle-orm';
import { db } from '../db/connection';
import { posts, users } from '../db/schema';
import type { CreatePostInput, UpdatePostInput, PostParams, PostQuery } from '../schemas/posts';
import { NotFoundError, AuthorizationError } from '../types/errors';

export const createPost = async (
  request: FastifyRequest<{ Body: CreatePostInput }>,
  reply: FastifyReply
) => {
  const { title, content, isPublished } = request.body;
  const userId = request.user!.id;

  const [newPost] = await db
    .insert(posts)
    .values({
      title,
      content,
      isPublished,
      userId,
    })
    .returning();

  return reply.success({ post: newPost }, 'Post created successfully', 201);
};

export const getPosts = async (
  request: FastifyRequest<{ Querystring: PostQuery }>,
  reply: FastifyReply
) => {
  const { page = 1, limit = 10, userId: filterUserId, isPublished } = request.query;
  const offset = (page - 1) * limit;

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
  const totalResult = await db
    .select({ total: count() })
    .from(posts)
    .where(whereClause);
  
  const total = totalResult[0]?.total || 0;

  return reply.paginated(postsData, {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
  });
};

export const getPost = async (
  request: FastifyRequest<{ Params: PostParams }>,
  reply: FastifyReply
) => {
  const { id } = request.params;

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
    throw new NotFoundError('Post not found');
  }

  return reply.success({ post }, 'Post retrieved successfully');
};

export const updatePost = async (
  request: FastifyRequest<{ Params: PostParams; Body: UpdatePostInput }>,
  reply: FastifyReply
) => {
  const { id } = request.params;
  const updates = request.body;
  const userId = request.user!.id;

  // Check if post exists and belongs to user
  const [existingPost] = await db
    .select()
    .from(posts)
    .where(and(eq(posts.id, id), eq(posts.userId, userId)))
    .limit(1);

  if (!existingPost) {
    throw new NotFoundError('Post not found or you do not have permission to update it');
  }

  // Update post
  const [updatedPost] = await db
    .update(posts)
    .set({ ...updates, updatedAt: new Date() })
    .where(eq(posts.id, id))
    .returning();

  return reply.success({ post: updatedPost }, 'Post updated successfully');
};

export const deletePost = async (
  request: FastifyRequest<{ Params: PostParams }>,
  reply: FastifyReply
) => {
  const { id } = request.params;
  const userId = request.user!.id;

  // Check if post exists and belongs to user
  const [existingPost] = await db
    .select()
    .from(posts)
    .where(and(eq(posts.id, id), eq(posts.userId, userId)))
    .limit(1);

  if (!existingPost) {
    throw new NotFoundError('Post not found or you do not have permission to delete it');
  }

  // Delete post
  await db.delete(posts).where(eq(posts.id, id));

  return reply.success(null, 'Post deleted successfully', 204);
};