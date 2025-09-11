import { z } from 'zod';

export const MetaSchema = z.object({
  timestamp: z.string(),
  requestId: z.string(),
  pagination: z
    .object({
      page: z.number(),
      limit: z.number(),
      total: z.number(),
      totalPages: z.number(),
    })
    .optional(),
});

export const SuccessResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) => z.object({
  status: z.literal('success'),
  message: z.string().optional(),
  data: dataSchema,
  meta: z.object({
    timestamp: z.string(),
    requestId: z.string(),
  }),
});

