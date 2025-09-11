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

export const ErrorResponseSchema = z.object({
  success: z.literal(false),
  message: z.string(),
  error: z.object({
    code: z.union([z.string(), z.number()]),
    details: z.any().optional(),
  }),
  meta: z.object({
    timestamp: z.string(),
    requestId: z.string(),
  }),
});


export const CommonErrorSchema = {
  400: ErrorResponseSchema,
  401: ErrorResponseSchema,
  403: ErrorResponseSchema,
  404: ErrorResponseSchema,
  409: ErrorResponseSchema,
  500: ErrorResponseSchema
}