import { z } from 'zod';

export const CreatePostSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255, 'Title too long'),
  content: z.string().optional(),
  isPublished: z.boolean().default(false),
});

export const UpdatePostSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255, 'Title too long').optional(),
  content: z.string().optional(),
  isPublished: z.boolean().optional(),
});

export const PostParamsSchema = z.object({
  id: z.coerce.number().positive('Invalid post ID'),
});

export const PostQuerySchema = z.object({
  page: z.coerce.number().positive().default(1),
  limit: z.coerce.number().positive().max(100).default(10),
  userId: z.coerce.number().positive().optional(),
  isPublished: z.coerce.boolean().optional(),
});

export type CreatePostInput = z.infer<typeof CreatePostSchema>;
export type UpdatePostInput = z.infer<typeof UpdatePostSchema>;
export type PostParams = z.infer<typeof PostParamsSchema>;
export type PostQuery = z.infer<typeof PostQuerySchema>;